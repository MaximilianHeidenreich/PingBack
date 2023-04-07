import { dev } from "$app/environment";
import type { IEvent } from "$lib/types/IEvent";
import { VERSION } from "./version";

export type TServiceWorkerMessageType =
    "_INIT" |
    "_INIT_SUCCESS" |
    "NEW_EVENTS" |
    "receivePushNotification";
export interface IServiceWorkerMessage<T> {
    type: TServiceWorkerMessageType;
    payload: T;
}

// background webnotify
export let sw_registration: ServiceWorkerRegistration;
export async function sw_register() {
    if (!("serviceWorker" in navigator)) return;
    if (sw_registration) return;
    console.info(`[ServiceWorker] Registering worker ...`);

    try {
        sw_registration = await navigator.serviceWorker.register("/service-worker.js", {
            scope: "/",
            updateViaCache: "none",
            type: dev ? "module" : "classic"
        });
    } catch (e) {
        console.error("[ServiceWorker] Could not register worker: ", e);
        throw e; // TODO: Better errs
    } // TODO: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
    navigator.serviceWorker.onmessage = onMessage;//.addEventListener("message", onMessage);
}

export async function client_sendMessageToWorker<T>(type: TServiceWorkerMessageType, payload: T) {
    if (!sw_registration) {
        console.warn("Tried to send message to service worker before registrated!");
        return;
    }
    if (!sw_registration.active) {
        console.warn("Tried to send message to registered service worker before active!");
        return;
    }
    sw_registration.active.postMessage({ type, payload } satisfies IServiceWorkerMessage<T>);
}

export function sw_init() { // TODO run in sw_register
    console.info("[ServiceWorker] Initializing service worker...");
    client_sendMessageToWorker("_INIT", {
        version: VERSION,
        origin: window.location.origin
    });
}

function onMessage(event: MessageEvent<IServiceWorkerMessage<any>>) {
    const t = event.data.type;
    const p = event.data.payload;
    console.debug(`[Window <- ServiceWorker] Received message ${t}`, p);
    if (t === "_INIT_SUCCESS") console.info("[ServiceWorker] Initialized!");
    else if (t === "NEW_EVENTS") onNewEvents(p);
}

function onNewEvents(payload: { events: IEvent[] }) {
    console.log("new events", payload.events);
}

/*export async function sw_registerrr() {
    if ("serviceWorker" in navigator) {

        //await Notification.requestPermission();

        console.log("Resistering service worker..")
        try {
            sw_registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });

            const subscription = await sw_registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BP4IatrOkh87p3CjGWmxcYSVAGYiKkt7M0An1p43Sdfak_t6k9jl4RyILdGW0_3tNZOu8BwYAxvxSAHqx84TVUc"
            })
            console.log("subscription", subscription);
            await fetch("/api/v1/push/subscribe", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
        catch (e) {
            console.info("ERR: Could not register service worker!");
            console.error(e);
        }


        /*Notification.requestPermission((result) => {
            if (result === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification("Vibration Sample", {
                body: "Buzz! Buzz!",
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: "vibration-sample",
            });
            });
    }
}*/

/*async function _onReceivePushNotification(payload: any) {
    console.log("Handling push notification:", payload);
    console.log("sw_registration", sw_registration);

        sw_registration.showNotification(payload.title, {
            body: payload.body,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
        });
    /*navigator.serviceWorker.ready.then((registration) => {
        sw_registration.showNotification(payload.title, {
            body: payload.body,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
        });
    });*/

    /*const notification = new Notification(payload.title, { body: payload.body });
    try {
        await sw_registration.showNotification(
            payload.title,
            {
                body: payload.body,
                //icon: "../images/touch/chrome-touch-icon-192x192.png",
                //vibrate: [200, 100, 200, 100, 200, 100, 200],
                //tag: "vibration-sample",
                timestamp: Date.now(),
                //silent: false,
            }
        );
    }
    catch (e) {
        console.error(e);
    }*/
/*}*/
