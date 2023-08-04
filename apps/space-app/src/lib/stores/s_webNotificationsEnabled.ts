import { browser } from "$app/environment";
import { storedWritable } from "./storedWritable";

export const s_webNotificationsEnabled = storedWritable<boolean>("pb_webNotificationsEnabled", false);

export function s_webNotificationsEnabled_getState() { // TODO: Better name for dis
    if (!browser || !("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    return false;
}
