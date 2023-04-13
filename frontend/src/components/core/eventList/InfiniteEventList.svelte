<script lang="ts">
    import { cache_SetFrame, type ICachedTimeFrame } from "$lib/client/cache";
    import { client_GetTimeFrame } from "$lib/client/timeFrame";
    import type { IEvent } from "$lib/types/IEvent";
    import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
    import dayjs, { type ManipulateType } from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";
    import { subscribeLive_newEvents, unsubscribeLive_newEvents } from "$lib/client/liveData";
    import { client_GetSysDoc } from "$lib/client/sysdoc";
    import { client_QueryEventsInFrameAll } from "$lib/client/event";

    // TYPES
    type IDisplayTimeFrame = {
        frameEnd: number; // End timestamp of frame
        events: IEvent[];
    }

    // PROPS
    export let startTimestamp: number = -1, // TODO: Remove?
        query: Record<string, any> | Record<string, any>[] = {},
        autoFetchFuture: boolean = false,
        autoFetchFutureInterval = 1000 * 2,
        useCache = true;// TOOD: Disabled, err after delete Object.keys(query).length === 0 ? true : false; // TODO!: Fix cached query

    // STATE
    let scrollEl: HTMLElement;
    let autoFetchFutureTimer: NodeJS.Timer | undefined;

    let loading = false;
    let endOfData = false;
    let processing = false;
    let processingProgress: [number, number] = [0, 0]; // [current, total]
    let timeFrames = writable<IDisplayTimeFrame[]>([]);
    let lastPastFrameEnd = dayjs(0);

    // FN
    async function getSystemLatestEventTimestamp() {
        const sysdoc = await client_GetSysDoc();
        if (!sysdoc) {
            // TODO: FATAL
            alert("FATAL error, no system document!");
        }
        return sysdoc.latestEventTimestamp;
    }
    function sumPreviousEvents(index: number): number {
        let sum = 0;
        for (let i = 0; i < index; i++) {
            sum += $timeFrames[i].events.length;
        }
        return sum;
    }

    // HANDLERS
    function onTriggerAutoLoadFuture() {
        console.debug("InfiniteEventList: Triggered autoLoadFuture");
        loadCurrent();
    }
    async function loadPast() {
        // TODO: Fix hack to prevent load trigger from list before getting sysdoc timestamp
        if (lastPastFrameEnd.valueOf() === dayjs(0).valueOf()) return;
        if (lastPastFrameEnd.valueOf() === dayjs(-1).valueOf()) {
            endOfData = true;
            return;
        }
        if (loading || endOfData) return;
        loading = true;

        const frameRes = await client_GetTimeFrame(lastPastFrameEnd.valueOf(), useCache); // TODO: Handle error
        if (!frameRes?.frame) {
            alert(`no frame for: ${lastPastFrameEnd.format()}`);
            return;
        }
        if (frameRes.frame.previousFrame === -1) endOfData = true;

        // Fetch events in frame
        let eventFetchRes = await client_QueryEventsInFrameAll(lastPastFrameEnd.valueOf(), query, useCache);

        // Sort events & update frames
        processingProgress = [0, eventFetchRes.items.length];
        processing = true;
        eventFetchRes.items.sort((a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        timeFrames.update((frames) => {
            const pendingFrame = {
                frameEnd: lastPastFrameEnd.valueOf(),
                events: eventFetchRes.items
            };
            frames.push(pendingFrame);
            return frames;
        });

        lastPastFrameEnd = dayjs(frameRes.frame.previousFrame);
        loading = false;



        /*
        //const p_frame = clientFetchEventFrame(fetch, lastPastFrameEnd.valueOf(), query);
        //const [frame] = await Promise.allSettled([p_frame]);
        //if (!moreFrames) endOfData = true;
        const frameFetchRes = await client_GetTimeFrame(lastPastFrameEnd.valueOf(), useCache); // TODO: Handle error
        if (!frameFetchRes) {
            alert(`no frame for: ${lastPastFrameEnd.format()}`);
            return;
        }
        if (frameFetchRes.previousFrame === -1) endOfData = true;

        // Fetch events in frame
        let eventFetchRes: { items: IEvent[]; count: number };
        // @ts-ignore - TODO: Fix type
        if (frameFetchRes.cached) {
            const cachedFrame = frameFetchRes as ICachedTimeFrame;
            const evs = Object.values(cachedFrame.events).map((p) => p).flat();
            eventFetchRes = {
                items: evs,
                count: evs.length
            }
            // TODO: Add query
        }
        else eventFetchRes = await clientFetchAllEventsInFrame(fetch, lastPastFrameEnd.valueOf(), query);

        // Sort events & update frames
        processingProgress = [0, eventFetchRes.items.length];
        processing = true;
        eventFetchRes.items.sort((a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        // Cache frame with events
        // @ts-ignore - TODO: Fix type
        if (useCache && !frameFetchRes.cached) await cache_SetFrame(frameFetchRes, eventFetchRes.items);

        timeFrames.update((frames) => {
            const pendingFrame = {
                frameEnd: lastPastFrameEnd.valueOf(),
                events: eventFetchRes.items
            };
            frames.push(pendingFrame);
            return frames;
        });

        lastPastFrameEnd = dayjs(frameFetchRes!.previousFrame);
        loading = false;*/
    }

    async function loadCurrent() {
        const currentFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
        const frameRes = await client_GetTimeFrame(currentFrameEnd, false); // TODO: Handle error
        if (!frameRes) return;  // NOTE: We dont error because there is just no events in current time frame yet

        const eventsRes = await client_QueryEventsInFrameAll(currentFrameEnd, query, false);

        // Sort events & update frames
        eventsRes.items.sort((a, b) => b.createdAt - a.createdAt);
        timeFrames.update(frames => {
            const i = $timeFrames.findIndex(f => f.frameEnd === currentFrameEnd);
            if (i < 0) {
                const pendingFrame = {
                    frameEnd: currentFrameEnd,
                    events: eventsRes.items,
                };
                pendingFrame.events.sort((a, b) => b.createdAt - a.createdAt);
                frames = [pendingFrame, ...frames];
                return frames;
            }
            else {
                const oldEvents = frames[i].events;
                frames[i].events = eventsRes.items; // TODO: remove whole block
                if (oldEvents.length !== frames[i].events.length) { // TODO: needs to handle multipel db request with limit better
                    const newEvents = eventsRes.items.filter((e) => oldEvents.findIndex(oe => oe.key === e.key) < 0);
                    //handleNewEventsNotify(newEvents);
                    // TODO: IMPL
                }
                frames[i].events.sort((a, b) => b.createdAt - a.createdAt);
                return frames;
            }
        })
    }

    async function onLiveNewEvents(events: IEvent[]) {
        console.warn("live new")
        const currentFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
        timeFrames.update(frames => {
            const i = $timeFrames.findIndex(f => f.frameEnd === currentFrameEnd);
            if (i < 0) {
                const pendingFrame = {
                    frameEnd: currentFrameEnd,
                    events,
                };
                pendingFrame.events.sort((a, b) => b.createdAt - a.createdAt);
                frames = [pendingFrame, ...frames];
                return frames;
            }
            else {
                for (const event of events) {
                    if (!frames[i].events.find(e => e.key === event.key)) {
                        frames[i].events.push(event);
                    }
                }
                frames[i].events.sort((a, b) => b.createdAt - a.createdAt);
                return frames;
            }
        })
    }

    onMount(async () => {
        lastPastFrameEnd = dayjs(await getSystemLatestEventTimestamp()).endOf(TIME_FRAME_OFFSET_UNIT);
        await loadPast();
        loadCurrent();
        subscribeLive_newEvents(onLiveNewEvents);
        //if (autoFetchFuture)
        //    autoFetchFutureTimer = setInterval(onTriggerAutoLoadFuture, autoFetchFutureInterval);
    });
    onDestroy(() => {
        unsubscribeLive_newEvents(onLiveNewEvents);
        //clearInterval(autoFetchFutureTimer);
    });

</script>

<div bind:this={scrollEl}>
    {#each $timeFrames as frame, i}
        <div class="frame">
            <EventList events={frame.events} indexOffset={sumPreviousEvents(i)}/>
        </div>
    {/each}
</div>

<InfiniteEventListTrigger
    observerRoot={scrollEl}
    {loading}
    {endOfData}
    {processing}
    {processingProgress}
    on:triggerLoad={loadPast} />
