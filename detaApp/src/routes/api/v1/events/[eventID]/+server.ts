import { getTimeFrame } from "$lib/helpers/event";
import { db_events, db_projects, db_system, DB_SYS_KEY, db_timeFrames } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { IEvent } from "$lib/types/IEvent";
import type { IProject } from "$lib/types/IProject";
import type { ISystemDoc } from "$lib/types/ISystemDoc";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ params }) => {
    const { eventID } = params;

    let event: IEvent | null;
    try {
        event = await db_events.get(eventID);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get event!");
    }

    if (!event) {
        return respondNotFound(`Event ${eventID} not found!`);
    }

    // Update sysdoc
    let sysdoc: ISystemDoc | null;
    try {
        sysdoc = await db_system.get(DB_SYS_KEY);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get sysdoc!");
    }
    if (!sysdoc) {
        return respondInternalError("Sysdoc not found!");
    }

    sysdoc.contentHash = crypto.randomUUID();
    sysdoc.totalEvents = sysdoc.totalEvents - 1;
    if (sysdoc.totalEvents === 0 && sysdoc.latestEventTimestamp === event.createdAt) sysdoc.latestEventTimestamp = -1;
    // TODO: rebuild latestEventTimestamp?

    try {
        await db_system.update(sysdoc, DB_SYS_KEY);
    }
    catch (e) {
        console.error(e);
        return respondInternalError("Could not update sysdoc!");
    }

    // Update project
    let project: IProject | null;
    try {
        project = await db_projects.get(event.project);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get event project!");
    }
    if (!project) {
        return respondInternalError("Event project not found!");
    }

    project.contentHash = crypto.randomUUID();
    if (project.eventSpecifiers[event.eventName]) {
        if (project.eventSpecifiers[event.eventName] - 1 === 0) delete project.eventSpecifiers[event.eventName];
        else project.eventSpecifiers[event.eventName] = project.eventSpecifiers[event.eventName] - 1;
    }
    // TODO: LatestEventTImestamp rebuild?

    try {
        await db_projects.update(project, project.key);
    }
    catch (e) {
        console.error(e);
        return respondInternalError("Could not update event project!");
    }

    // Delete TimeFrame if empty & update frame links
    let frame: ITimeFrame | null;
    let previousFrame: ITimeFrame | null;
    let nextFrame: ITimeFrame | null;
    try {
        frame = await db_timeFrames.get(getTimeFrame(event.createdAt).valueOf().toString());
        if (!frame) {
            return respondNotFound(`Event TimeFrame ${getTimeFrame(event.createdAt).valueOf().toString()} not found!`);
        }
        previousFrame = await db_timeFrames.get(frame.previousFrame.toString());
        nextFrame = await db_timeFrames.get(frame.nextFrame.toString());
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get event!");
    }

    if (previousFrame && !nextFrame) previousFrame.nextFrame = -1;
    if (!previousFrame && nextFrame) nextFrame.previousFrame = -1;
    if (previousFrame && nextFrame) {
        previousFrame.nextFrame = frame.nextFrame;//nextFrame.frameEnd;
        nextFrame.previousFrame = frame.previousFrame;//previousFrame.frameEnd;
    }
    try {
        previousFrame && await db_timeFrames.update(previousFrame, previousFrame.key);
        nextFrame && await db_timeFrames.update(nextFrame, nextFrame.key);
        await db_timeFrames.delete(frame.key);
    }
    catch (e) {
        console.error(e);
        return respondInternalError("Could not delete associated event TimeFrame!");
    }

    try {
        await db_events.delete(eventID);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not delete event!");
    }

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
