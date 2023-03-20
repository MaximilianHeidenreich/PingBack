import { db_events, db_projects } from "$lib/server/deta";
import type { IEvent, TEventParser } from "$lib/types/IEvent";
import { VERSION } from "$lib/utils/version";
import dayjs, { Dayjs } from "dayjs";

export type TCreateEvent = {
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
};
/**
 * Creates a new event.
 * @param event
 * @throws Deta error.
 */
export async function serverCreateEvent(event: TCreateEvent): Promise<IEvent> {
    const project = await db_projects.get(event.project);
    if (!project) throw new Error(`Project ${event.project} does not exist.`);
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

/**
 * Gets the frame for a given event timestamp.
 * "Frames" are used for segmenting events into smaller chunks.
 * @param timestamp
 */
function getEventFrame(timestamp: number): Dayjs {
    return dayjs(timestamp).endOf("hour");
}
