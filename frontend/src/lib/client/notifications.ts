import { s_clientId } from "$lib/stores/s_clientId";
import { s_webNotificationsEnabled } from "$lib/stores/s_webNotificationsEnabled";
import { sw_registration } from "$lib/utils/serviceWorker";
import toastOptions from "$lib/utils/toast";
import { VERSION } from "$lib/utils/version";
import toast from "svelte-french-toast";
import { get } from "svelte/store";
import { client_GetSysDoc } from "./sysdoc";

export function registerPushManager() {
    /*navigator.serviceWorker
    const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey:*/
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (Notification.permission === "granted") return true;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        toast.success("Notifications are enabled!", toastOptions());
    }
    s_webNotificationsEnabled.set(permission === "granted" ? true : false);
    return permission === "granted";
}

export function subscribeToPushNotifications() {
    toast.promise(new Promise<void>(async (res, rej) => {
        if (!(await requestNotificationPermission())) {
            console.error("You need to allow notifications for push notifications!");
            return rej();
        }
        if (!sw_registration) {
            console.error("Service worker not running! Contact developer!");
            return rej();
        }

        // Get sysdoc for vapid key
        const sysdoc = await client_GetSysDoc();

        const subscription = await sw_registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: sysdoc.publicVapidKey
        });
        console.warn("sub", subscription)

        const url = new URL(`/api/v${VERSION.major}/notifications/subscribe`, window.location.origin);
        const subRes = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientId: get(s_clientId),
                subscription
            })
        });
        if (!subRes.ok) {
            //if (subRes.status === 404) throw new NotFound(subRes.statusText);
            console.error(subRes);
            return rej();
        }

        return res();
    }), {
        loading: "Enabling push notifications...",
        success: "Enabled push notifications!",
        error: "Could not enable push notifications!",
    }, toastOptions());
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

