import type { IEvent } from "$lib/types/IEvent";
import { sw_sendMessageToClient } from ".";

export async function sw_handleNewEvents(events: IEvent[]) {
    sw_sendMessageToClient("NEW_EVENTS", { events })
}
