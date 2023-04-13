import { NotFound } from "$lib/errors/core";
import { clientFetchAllEventsInFrame } from "$lib/helpers/api/eventClient";
import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_UNIT, type ITimeFrame } from "$lib/types/ITimeFrame";
import toastOptions from "$lib/utils/toast";
import dayjs from "dayjs";
import toast from "svelte-french-toast";
import { showNativeNotification } from "./notifications";
import { client_GetTimeFrame } from "./timeFrame";
import { browser } from "$app/environment";

let liveTriggerTimer: NodeJS.Timer | null = null;
export function client_EnableLiveData(updateInterval: number = 3000) {
    if (liveTriggerTimer) return;
    liveUpdateEnabledTimestamp = Date.now();
    liveTriggerTimer = setInterval(onUpdate, updateInterval);
}

export function client_DisableLiveData() {}

// LiveUpdate state
let liveUpdateEnabledTimestamp: number = 0;
let knownNewEventKeys: string[] = [];

function onUpdate() {
    if (!browser) return;
    console.debug("[LiveUpdate] Triggered update.");

    //_updateForNewEvents();
}

const liveSubs_newEvents: ((events: IEvent[]) => void)[] = [];
export const subscribeLive_newEvents = (c: (events: IEvent[]) => void) => !liveSubs_newEvents.includes(c) ? liveSubs_newEvents.push(c) : null;
export const unsubscribeLive_newEvents = (c: (events: IEvent[]) => void) => liveSubs_newEvents.includes(c) ? liveSubs_newEvents.slice(liveSubs_newEvents.indexOf(c), 1) : null;
function pushLive_newEvents (newEvents: IEvent[]) {
    for (let consumer of liveSubs_newEvents) {
        consumer(newEvents);
    }
}

async function _updateForNewEvents() {
    const currFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
    let frame: ITimeFrame | null;
    try {
        frame = (await client_GetTimeFrame(currFrameEnd, false))?.frame || null;
        if (!frame) return;
    } catch (e) {
        if (e instanceof NotFound) return; // Dis ok
        console.error(e);
    }
    const eventFetchRes = await clientFetchAllEventsInFrame(
        fetch,
        currFrameEnd,
        { "createdAt?gt": liveUpdateEnabledTimestamp },
        false
    );
    eventFetchRes.items.sort((a, b) => b.createdAt - a.createdAt);

    // Find new events
    const newEvents: IEvent[] = [];
    for (const event of eventFetchRes.items) {
        if (!knownNewEventKeys.includes(event.key)) {
            newEvents.push(event);
            knownNewEventKeys.push(event.key);
        }
    }
    handleNewEvents(newEvents);
}


async function handleNewEvents(events: IEvent[]) {
    pushLive_newEvents(events);

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
