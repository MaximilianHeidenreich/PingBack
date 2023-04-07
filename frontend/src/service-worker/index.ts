/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { NotFound } from "$lib/errors/core";
import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_UNIT, type ITimeFrame } from "$lib/types/ITimeFrame";
import type { IServiceWorkerMessage, TServiceWorkerMessageType } from "$lib/utils/serviceWorker";
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

export interface IWorkerContext {
    VERSION: { major: number, minor: number, patch: number } | null;
    ORIGIN: string | null;
}
const CONTEXT: IWorkerContext = {
    VERSION: null,
    ORIGIN: null,
};
const hasContext = () => CONTEXT.VERSION && CONTEXT.ORIGIN;

// MESSAGING
let CLIENT: any | null = null;
export function sw_sendMessageToClient<T>(type: TServiceWorkerMessageType, payload: T) {
    console.warn(CLIENT);

    if (!CLIENT) {
        console.warn("[ServiceWorker] Tried to send message to client before reference set!");
        return;
    }
    CLIENT.postMessage({ type, payload } satisfies IServiceWorkerMessage<T>);
}

function onMessage(event: MessageEvent<IServiceWorkerMessage<any>>) {
    if (!CLIENT) CLIENT = event.source;
    const t = event.data.type;
    const p = event.data.payload;
    console.debug(`[Window -> ServiceWorker] Received message ${t}`, p);
    if (t === "_INIT") onInit(p);
}

function onInit(payload: {
    version: { major: number, minor: number, patch: number },
    origin: string,
}) {
    //if (wid !== payload.id) return;
    CONTEXT.VERSION = payload.version;
    CONTEXT.ORIGIN = payload.origin;
    console.debug(`[ServiceWorker] Initializing with context:`, CONTEXT);

    //setup_newEventFetcher();

    sw_sendMessageToClient("_INIT_SUCCESS", null);
}

// EVENT LISTENERS
self.addEventListener("install" , e => {});
self.addEventListener("activate", e => {});
self.onmessage = onMessage;

/*self.addEventListener("push", function(e) {
    const event = e as PushEvent;
    const data = event.data?.json(); // TODO: empty data handling
    console.info("Received push notification:", data);

    _sendMessage({ type: "receivePushNotification", payload: data });
});*/


// ================ Current event fetcher
let pastNewEventKeys: string[] = [];
async function onFetchNewEvents() {
    if (!hasContext()) return; // TODO: Throw?

    const currFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
    let frame: ITimeFrame | null;
    try {
        frame = await sw_GetTimeFrame(CONTEXT, currFrameEnd);
        if (!frame) return;
    } catch (e) {
        if (e instanceof NotFound) return;
        console.error(e);
    }
    const eventFetchRes = await sw_FetchAllEventsInFrame(CONTEXT, currFrameEnd, {});

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
    setInterval(onFetchNewEvents, 3000);
}
