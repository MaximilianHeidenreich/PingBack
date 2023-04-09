import { DetaBaseError, Invalid, InvalidSystemState, InvalidZod, NotFound } from "$lib/errors/core";
import { getTimeFrameEnd } from "$lib/shared/timeFrame";
import { ZEventIcon, ZEventKey, ZEventName, ZEventTitle, type IEvent } from "$lib/types/IEvent";
import { ZProjectKey } from "$lib/types/IProject";
import { TIME_FRAME_OFFSET_UNIT, type ITimeFrame } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import dayjs from "dayjs";
import { z } from "zod";
import { db_events, db_projects, db_system, DB_SYS_KEY, db_timeFrames } from "./deta";
import { respondInternalError } from "./responseHelper";

/**
 * Type for creating a new event.
 * Optional fields can be used to override defaults.
 */
export interface ICreateEvent extends Partial<IEvent> {
    project: string;
    channel: string;
    name: string;
    title: string;
    description: string | object;
}
export const SCreateEvent = z.object({
    key: ZEventKey.optional().default(() => crypto.randomUUID()),
    v: z.number().optional().default(VERSION.major),
    createdAt: z
        .number()
        .optional()
        .default(() => dayjs().valueOf()),

    project: ZProjectKey,
    channel: z.string(),
    name: ZEventName,
    notify: z.boolean().optional().default(true),
    icon: ZEventIcon.optional().default("🔔"), // TODO: Default icon? or allow null icon
    parser: z.enum(["text", "markdown", "json", "log"]).default("text"), //z.string().optional().default("text"),// .infer<typeof TEvent>(),

    title: ZEventTitle,
    description: z.string().optional().default(""),
    tags: z.record(z.string(), z.unknown()).optional().default({})
});

/**
 * Creates an event.
 * Updates sysdoc and event's project and creates / updates its time frame.
 * @param event
 * @returns
 */
export async function server_createEvent(event: ICreateEvent): Promise<IEvent> {
    // Parse event args
    const parseRes = SCreateEvent.safeParse(event);
    if (!parseRes.success) throw new InvalidZod("Invalid data", parseRes.error);
    const parsedEvent = parseRes.data;

    // Fetch deps
    let sysdoc, frame, project;
    try {
        [sysdoc, frame, project] = await Promise.all([
            db_system.get(DB_SYS_KEY),
            db_timeFrames.get(dayjs(parsedEvent.createdAt).endOf(TIME_FRAME_OFFSET_UNIT).valueOf().toString()),
            db_projects.get(parsedEvent.project)
        ]);
    } catch (e) {
        console.error("err: createEvent get [sydoc, frame, proejct]");
        throw e;
    } // TODO: HANDLE
    if (!sysdoc) throw new InvalidSystemState("Sysdoc missing!");
    if (!project) throw new Invalid(`Invalid project ${parsedEvent.project}`);
    if (!project.channels.find((c) => c.id === parsedEvent.channel)) throw new Invalid(`Invalid channel ${parsedEvent.channel}`);

    // Add / update time frame
    if (!frame) {
        const latestFrame =
            sysdoc.latestEventTimestamp === -1
                ? null
                : await db_timeFrames.get(
                    getTimeFrameEnd(sysdoc.latestEventTimestamp).valueOf().toString()
                );
        //if (!latestFrame) throw "nolatestframe server_createEvent"; // TODO!: HANDLE
        const pendingTimeFrame: ITimeFrame = {
            key: "",
            frameEnd: dayjs(parsedEvent.createdAt).endOf(TIME_FRAME_OFFSET_UNIT).valueOf(),
            nextFrame: -1,
            previousFrame:
                sysdoc.latestEventTimestamp === -1
                    ? -1
                    : getTimeFrameEnd(sysdoc.latestEventTimestamp).valueOf(),
            eventCount: 1,
            containsEventsFor: {
                projects: [project.key],
                channels: [`${project.key}#${event.channel}`]
            }
        };
        if (latestFrame) latestFrame.nextFrame = pendingTimeFrame.frameEnd;
        try {
            await Promise.all([
                db_timeFrames.put(pendingTimeFrame, pendingTimeFrame.frameEnd.toString()),
                latestFrame ? db_timeFrames.update(latestFrame, latestFrame.key) : Promise.resolve()
            ]);
        } catch (e) {
            // NOTE: We don't throw because:
            // 1. Multipel requests, one thinks there is no frame yet, but another created it
            // -> We still want to insert the event and let it get ingested later
            console.warn("Exception during new time frame insert / lastestFrame update:", e);
            //throw new DetaBaseError("Could not perform db fetch of frame.", e);
        }
    } else {
        frame.eventCount += 1;
        if (!frame.containsEventsFor.projects.includes(project.key))
            frame.containsEventsFor.projects.push(project.key);
        if (!frame.containsEventsFor.channels.includes(`${project.key}#${event.channel}`))
            frame.containsEventsFor.channels.push(`${project.key}#${event.channel}`);
    }

    // Update sysdoc & project
    sysdoc.totalEvents += 1;
    sysdoc.latestEventTimestamp = parsedEvent.createdAt;
    project.latestEventTimestamp = parsedEvent.createdAt;
    project.channels.find((c) => c.id === event.channel)!.latestEventTimestamp =
        parsedEvent.createdAt;
    if (!Object.keys(project.eventSpecifiers).includes(parsedEvent.name))
        project.eventSpecifiers[parsedEvent.name] = 1;
    else project.eventSpecifiers[parsedEvent.name] += 1;

    // Perform insert & updates
    let newEvent;
    try {
        // NOTE: We dont put db_events into Promise.all() to prevent system changes when event insert fails.
        newEvent = await db_events.insert(parsedEvent, parsedEvent.key);
        await Promise.all([
            db_system.update(sysdoc, DB_SYS_KEY),
            db_projects.update(project, project.key),
            frame ? db_timeFrames.update(frame, frame.key) : Promise.resolve()
        ]);
    } catch (e) {
        console.error("err, insert newEvent & await sys updates", e);
        throw new DetaBaseError("Could not perform db updates.", e);
    }

    return newEvent;
}

/**
 * Deletes an event.
 * Updates sysdoc, event's project and its time frame.
 * When the time frame is empty, it is deleted and the surrounding frames are connected.
 * @param eventId
 * @throws NotFound, Invalid, DetaBaseError
 */
export async function server_deleteEvent(eventId: string) {
    let event: IEvent | null;
    try {
        event = await db_events.get(eventId);
    } catch (e) {
        throw new DetaBaseError("Error in get event!", e);
    }
    if (!event) {
        throw new NotFound(`Event ${eventId} not found`);
    }

    let frame: ITimeFrame | null;
    try {
        frame = await db_timeFrames.get(getTimeFrameEnd(event.createdAt).valueOf().toString());
    } catch (e) {
        throw e; // TODO!: HANDLE
    }
    if (!frame) {
        throw new NotFound(`Frame ${event.createdAt} not found`);
    }

    // Fetch deps
    const p_sysdoc = db_system.get(DB_SYS_KEY);
    const p_prevFrame = db_timeFrames.get(frame.previousFrame.toString());
    const p_nextFrame = db_timeFrames.get(frame.nextFrame.toString());
    const p_project = db_projects.get(event.project);

    let sysdoc, prevFrame, nextFrame, project;
    try {
        [sysdoc, prevFrame, nextFrame, project] = await Promise.all([
            p_sysdoc,
            p_prevFrame,
            p_nextFrame,
            p_project
        ]);
    } catch (e) {
        throw e;
    } // TODO!: HANDLE
    if (!sysdoc) throw new NotFound(`SYS_DOC not found`);
    if (!project) throw new NotFound(`Project ${event.project} not found`);

    // Update sysdoc & project
    sysdoc.contentHash = crypto.randomUUID();
    sysdoc.totalEvents -= 1;
    //if (!nextFrame) sysdoc.latestEventTimestamp = prevFrame ? prevFrame.frameEnd : -1;
    if (sysdoc.totalEvents === 0) sysdoc.latestEventTimestamp = -1;
    project.contentHash = crypto.randomUUID();
    if (project.eventSpecifiers[event.name]) {
        if (project.eventSpecifiers[event.name] - 1 === 0)
            delete project.eventSpecifiers[event.name];
        else project.eventSpecifiers[event.name] -= 1;
    }

    // Update time frame(s)
    frame.eventCount -= 1;
    if (frame.eventCount <= 0) {
        // Connect previous & next frames
        if (prevFrame && !nextFrame) prevFrame.nextFrame = -1;
        if (!prevFrame && nextFrame) nextFrame.previousFrame = -1;
        if (prevFrame && nextFrame) {
            prevFrame.nextFrame = frame.nextFrame;
            nextFrame.previousFrame = frame.previousFrame;
        }

        // Change sysdoc.latestEventTimestamp only if inside current frame
        if (
            dayjs(sysdoc.latestEventTimestamp).isAfter(
                dayjs(frame.frameEnd).startOf(TIME_FRAME_OFFSET_UNIT)
            ) &&
            dayjs(sysdoc.latestEventTimestamp).isBefore(
                dayjs(frame.frameEnd).endOf(TIME_FRAME_OFFSET_UNIT)
            )
        ) {
            if (nextFrame) sysdoc.latestEventTimestamp = nextFrame.frameEnd;
            else if (prevFrame) sysdoc.latestEventTimestamp = prevFrame.frameEnd;
            else sysdoc.latestEventTimestamp = -1; // TODO: This probably is a system state error.?
        }

        // Delete event frame
        try {
            await db_timeFrames.delete(frame.key);
        } catch (e) {
            throw e; // TODO!: HANDLE
        }
        frame = null; // Prevent update later on
    }

    // Perform delete & updates
    try {
        // NOTE: We dont put db_events into Promise.all() to prevent system changes when event insert fails.
        await db_events.delete(event.key);
        await Promise.all([
            db_system.update(sysdoc, DB_SYS_KEY),
            db_projects.update(project, project.key),
            frame ? db_timeFrames.update(frame, frame.key) : Promise.resolve(),
            prevFrame ? db_timeFrames.update(prevFrame, prevFrame.key) : Promise.resolve(),
            nextFrame ? db_timeFrames.update(nextFrame, nextFrame.key) : Promise.resolve()
        ]);
    } catch (e) {
        throw e; // TODO!: HANDLE
    }
}
