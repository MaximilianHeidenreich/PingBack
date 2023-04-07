import { s_webNotificationsEnabled } from "$lib/stores/s_webNotificationsEnabled";
import toastOptions from "$lib/utils/toast";
import toast from "svelte-french-toast";
import { get } from "svelte/store";

export function registerPushManager() {
    /*navigator.serviceWorker
    const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey:*/
}

export async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        toast.success("Notifications are enabled!", toastOptions());
    }
    s_webNotificationsEnabled.set(permission === "granted" ? true : false);
}

export interface ICreateNotification {
    title: string;
    // badge
    body?: string;
    tag?: string;
    icon?: string;
    // image
    data?: unknown;
    // vibrate
    // renotify
    // requireInteraction
    // actions
    // silent
}
export async function showNativeNotification(noti: ICreateNotification) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
        console.warn("[Notifications] Trying to push notification without knowing permission!");
        return;
    }
    console.warn("weben", get(s_webNotificationsEnabled));
    if (Notification.permission === "denied" || !get(s_webNotificationsEnabled)) return;
    //if (!noti.icon) noti.icon = "/v1_pingback-logo_ios@1024.png";
    new Notification(noti.title, { ...noti });
}

