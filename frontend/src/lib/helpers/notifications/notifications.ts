import { showNativeNotification } from "$lib/client/notifications";
import type { IEvent } from "$lib/types/IEvent";
import toastOptions from "$lib/utils/toast";
import toast from "svelte-french-toast";

/**
 * Handle new events -> Whether and how to send a notification.
 * @param events
 */
export function handleNewEventsNotify(events: IEvent[]) {
    events.forEach(event => {
        //if (!event.notify) return;
        toast(event.title, toastOptions({ // TODO: Custom renderer -> On click open
            style: "font-weight: 500",
            duration: 5000,
            icon: event.icon
        }));
        showNativeNotification({
            title: event.title,
            body: event.parser === "text" ? event.description as string : ""
        })
    });
}
