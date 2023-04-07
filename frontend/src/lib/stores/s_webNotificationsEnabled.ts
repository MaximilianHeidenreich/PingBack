import { browser } from "$app/environment";
import { localStorable } from "./localStorable";

export const s_webNotificationsEnabled = localStorable<boolean>(false, "pb_webNotificationsEnabled");

export function s_webNotificationsEnabled_getState() { // TODO: Better name for dis
    if (!browser || !("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    return false;
}
