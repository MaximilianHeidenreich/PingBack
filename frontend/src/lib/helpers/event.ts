import { db_timeFrames, db_events, db_projects, db_system, DB_SYS_KEY } from "$lib/server/deta";
import type { IEvent, TEventParser } from "$lib/types/IEvent";
import type { IProject } from "$lib/types/IProject";
import { TIME_FRAME_OFFSET_UNIT, type ITimeFrame } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import dayjs, { Dayjs } from "dayjs";

/*export interface ICreateEvent {
    project: string;
    channel: string;
    eventName: string;
    notify?: boolean;
    icon?: string;
    parser?: TEventParser;

    // PAYLOAD
    title: string;
    description: unknown;
    tags?: Record<string, unknown>;
};*/
/**
 * Creates a new event.
 * @param event
 * @throws Deta error.
 */
/*export async function serverCreateEvent(
    event: ICreateEvent,
    project: IProject
): Promise<IEvent | null> {
    const timestamp = dayjs();
    const timeFrame = await db_timeFrames.get(timestamp.endOf(TIME_FRAME_OFFSET_UNIT).valueOf().toString());
    const sysdoc = await db_system.get(DB_SYS_KEY);
    if (!sysdoc) throw "nosysdoc serverCreateEvent"; // TODO: HANDLE

    /*let pendingEvent: IEvent = {
        key: crypto.randomUUID(),
        v: VERSION.major,
        createdAt: timestamp.valueOf(),

        project: event.project,
        channel: event.channel,
        eventName: event.eventName,
        notify: event.notify || true,
        icon: event.icon || "🔔",
        parser: event.parser || "text",

        title: event.title,
        description: event.description || "",
        tags: event.tags || {}
    }
    let pendingEvent: IEvent = {
        key: crypto.randomUUID(),
        createdAt: timestamp.valueOf(),
        v: VERSION.major,
        ...event,
        notify: event.notify || true,
        parser: event.parser || "text",
        tags: event.tags || {},
    };

    // Add / update event frame.
    if (!timeFrame) {
        const lastFrameEnd = getTimeFrame(sysdoc.latestEventTimestamp).valueOf();
        const pendingTimeFrame: Omit<ITimeFrame, "key"> = {
            frameEnd: timestamp.endOf(TIME_FRAME_OFFSET_UNIT).valueOf(),
            nextFrame: -1,
            previousFrame: lastFrameEnd,
            eventCount: 1,
            containsEventsFor: {
                projects: [project.key],   // TODO: impl
                channels: [`${project.key}#${event.channel}`]    // TODO: impl
            }

        }
        const latestTimeFrame = await db_timeFrames.get(lastFrameEnd.toString());
        if (!latestTimeFrame) {
            throw "no latest time frame"; // TODO: Handle
        }
        latestTimeFrame.nextFrame = pendingTimeFrame.frameEnd;

        await db_timeFrames.update(latestTimeFrame, latestTimeFrame.key); // TODO: Promise allSettled
        await db_timeFrames.put(pendingTimeFrame as ITimeFrame, pendingTimeFrame.frameEnd.toString()); // TODO: Fix typecast
    }
    else {
        timeFrame.eventCount = timeFrame.eventCount + 1;
        if (!timeFrame.containsEventsFor.projects.includes(project.key))
            timeFrame.containsEventsFor.projects.push(project.key);
        if (!timeFrame.containsEventsFor.channels.includes(`${project.key}#${event.channel}`))
            timeFrame.containsEventsFor.channels.push(`${project.key}#${event.channel}`);
        await db_timeFrames.update(timeFrame, timeFrame.key);
    }

    sysdoc.totalEvents += 1;
    sysdoc.latestEventTimestamp = pendingEvent.createdAt;
    sysdoc.updatedAt = Date.now();

    await db_system.update(sysdoc, sysdoc.key); // TODO: Promise allSettled

    project.latestEventTimestamp = pendingEvent.createdAt;
    project.channels.find((c) => c.id === event.channel)!.latestEventTimestamp = pendingEvent.createdAt;
    if (!Object.keys(project.eventSpecifiers).includes(pendingEvent.eventName))
        project.eventSpecifiers[pendingEvent.eventName] = 1;
    else project.eventSpecifiers[pendingEvent.eventName] += 1;

    // TOO Await multiple
    await db_projects.update(project, project.key);

    let newEvent;
    try {
        newEvent = await db_events.put(pendingEvent, pendingEvent.key); // TODO: Revert project on err?
    }
    catch (err) {
        console.error(err);
        //return respondInternalError("Failed to create event!");
    }
    return newEvent || null;

    //const project = await db_projects.get(event.project);
    /*if (!project) throw new Error(`Project ${event.project} does not exist.`);
    if (project.channels.findIndex((e) => e.id === event.channel) === -1)
        throw new Error(`Channel ${event.channel} does not exist in project ${event.project}.`);

    let pending_event: IEvent = {
        key: crypto.randomUUID(),
        createdAt: Date.now(),
        v: VERSION.major, // TODO: only major version

        project: event.project,
        channel: event.channel,
        eventName: event.eventName,
        notify: event.notify || true,
        icon: event.icon || "🔔",
        parser: event.parser || "text",

        title: event.title,
        description: event.description,
        tags: event.tags || {}
    };

    // Update project system meta.
    project.latestEventTimestamp = pending_event.createdAt;
    if (!Object.keys(project.eventSpecifiers).includes(pending_event.eventName))
        project.eventSpecifiers[pending_event.eventName] = 1;
    else project.eventSpecifiers[pending_event.eventName] += 1;
    await db_projects.update(project, project.key);

    const res = await db_events.put(pending_event, pending_event.key); // TODO: Revert project on err?
    return res;
}

*/