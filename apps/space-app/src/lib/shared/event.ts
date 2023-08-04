import type { IEvent } from "$lib/types/IEvent";

export function mapEventProjectsIntoRecord(events: IEvent[]) {
    const eventMap = new Map<string, IEvent[]>();
    for (const event of events) {
        if (!eventMap.has(event.project)) eventMap.set(event.project, []);
        eventMap.get(event.project)!.push(event);
    }
    return Object.fromEntries(eventMap);
}