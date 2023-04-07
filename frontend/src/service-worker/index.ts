/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { NotFound } from "$lib/errors/core";
import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_UNIT, type ITimeFrame } from "$lib/types/ITimeFrame";
import type { IServiceWorkerMessage } from "$lib/utils/serviceWorker";
import dayjs from "dayjs";
import { sw_FetchAllEventsInFrame } from "./events";
import { sw_handleNewEvents } from "./notifications";
import { sw_GetTimeFrame } from "./timeFrame";

//import { build, files, prerendered, version } from "$service-worker";
//import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
/*const precache_list = [
  '/', // Attention: might not be ideal for your use case - read more below.
  ...build,
  ...files,
  ...prerendered
].map(s => ({
  url: s,
  revision: version
}))
precacheAndRoute(precache_list);*/

export interface IWorkerInitialization { // TODO: Rename to worker context
    VERSION: { major: number, minor: number, patch: number } | null;
    ORIGIN: string | null;
}
const WORKER_INITIALIZATION: IWorkerInitialization = {
    VERSION: null,
    ORIGIN: null
};

// MESSAGING API
let messagingPort: MessagePort;
export function _sendMessage(message: IServiceWorkerMessage<unknown>) {
    if (messagingPort) messagingPort.postMessage(message);
}
function _messageHandler(event) {
    console.log("msg trig", event)
    _handleMessage(event, event.data);
}
function _handleMessage(event: MessageEvent<any>, message: IServiceWorkerMessage<unknown>) {
    console.debug(`[Window -> ServiceWorker] Received message ${message.type}`, message.payload);
    if (message.type === "_INIT") {
        _onInit(event, message);
    }
}
function _onInit(event: MessageEvent<any>, message: IServiceWorkerMessage<{
    appVersion: { major: number, minor: number, patch: number },
    appOrigin: string,
    msgPort: MessagePort
}>) {
    //console.log(event)
    //messagingPort = event.ports[0];
    messagingPort = message.payload.msgPort;
    
    WORKER_INITIALIZATION.VERSION = message.payload.appVersion;
    WORKER_INITIALIZATION.ORIGIN = message.payload.appOrigin
    console.debug(`[ServiceWorker] Initializing with:`, WORKER_INITIALIZATION);

    setup_newEventFetcher();

    _sendMessage({ type: "_INIT_SUCCESS", payload: null });
}


// EVENT LISTENERS
function _swInstall(event) {}
function _swActivate(event) {}
self.addEventListener("install" , _swInstall);
self.addEventListener("activate", _swActivate);
self.addEventListener("message", _messageHandler);

/*self.addEventListener("push", function(e) {
    const event = e as PushEvent;
    const data = event.data?.json(); // TODO: empty data handling
    console.info("Received push notification:", data);

    _sendMessage({ type: "receivePushNotification", payload: data });
});*/


// ================ Current event fetcher
let pastNewEventKeys: string[] = [];
async function onFetchNewEvents() {
    if (!WORKER_INITIALIZATION.VERSION || !WORKER_INITIALIZATION.ORIGIN) return; // TODO: Thow?
    
    const currFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
    let frame: ITimeFrame | null;
    try {
        frame = await sw_GetTimeFrame(WORKER_INITIALIZATION, currFrameEnd);
        if (!frame) return;
    } catch (e) {
        if (e instanceof NotFound) return;
        console.error(e);
    }
    const eventFetchRes = await sw_FetchAllEventsInFrame(WORKER_INITIALIZATION, currFrameEnd, {});

     // Sort events & handle new
    eventFetchRes.items.sort((a, b) => b.createdAt - a.createdAt);

    // Find new events
    const newEvents: IEvent[] = [];
    for (const event of eventFetchRes.items) {
        if (!pastNewEventKeys.includes(event.key)) {
            newEvents.push(event);
            pastNewEventKeys.push(event.key);
        }
    }
    sw_handleNewEvents(newEvents);
}
function setup_newEventFetcher() {
    console.error("!!!! SETTING INTERVAL")
    setInterval(onFetchNewEvents, 3000);
}
