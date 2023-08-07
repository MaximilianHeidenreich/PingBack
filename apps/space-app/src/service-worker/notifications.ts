import type { IEvent } from "@pingback/shared";
import { sw_sendMessageToClient } from ".";

export async function sw_handleNewEvents(events: IEvent[]) {
    sw_sendMessageToClient("NEW_EVENTS", { events })
}
