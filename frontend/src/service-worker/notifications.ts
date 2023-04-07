import type { IEvent } from "$lib/types/IEvent";
import { _sendMessage } from ".";

export async function sw_handleNewEvents(events: IEvent[]) {
    _sendMessage({ type: "NEW_EVENTS", payload: events });
}
