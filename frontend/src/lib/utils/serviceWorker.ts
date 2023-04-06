export type TServiceWorkerMessageType =
    "_INIT" |
    "_INIT_SUCCESS" |
    "receivePushNotification";
export interface IServiceWorkerMessage<T> {
    type: TServiceWorkerMessageType;
    payload: T;
}

let sw_registration: ServiceWorkerRegistration;
export async function sw_register() {
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
        // TODO: Add catch


        /*Notification.requestPermission((result) => {
            if (result === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification("Vibration Sample", {
                body: "Buzz! Buzz!",
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: "vibration-sample",
            });
            });*/
    }
}


export const sw_messageChannel = new MessageChannel();

sw_messageChannel.port1.onmessage = function(event) {
    const message = event.data as IServiceWorkerMessage<unknown>;
    console.debug("Received message from service worker:", message);

    if (message.type === "_INIT_SUCCESS") {
        console.info("Service worker messaging initialized successfully");
    }
    else if (message.type === "receivePushNotification") {
        _onReceivePushNotification(message.payload);
    }
};
async function _onReceivePushNotification(payload: any) {
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
}

function _sendMessage(message: IServiceWorkerMessage<unknown>) {
    if (!navigator.serviceWorker.controller) {
        alert("Fatal: No service worker controller!") // TODO: Better error handling
        return;
    }
    navigator.serviceWorker.controller.postMessage(message, [sw_messageChannel.port2]);
}

export function sw_init() {
    console.info("Trying to initialize service worker messaging...");
    _sendMessage({ type: "_INIT", payload: null });
}