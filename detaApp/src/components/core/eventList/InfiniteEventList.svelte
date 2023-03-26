<script lang="ts">
    import { clientFetchAllEventsInFrame } from "$lib/helpers/api/eventClient";
    import { clientGetSysDoc } from "$lib/helpers/api/systemClient";
    import { clientGetTimeFrame } from "$lib/helpers/api/timeFrameClient";
    import { cacheSetTimeFrame } from "$lib/helpers/cache";
    import { handleNewEventsNotify } from "$lib/helpers/notifications/notifications";
    import type { IEvent } from "$lib/types/IEvent";
    import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
    import dayjs, { type ManipulateType } from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";

    // TYPES
    type IDisplayTimeFrame = {
        frameEnd: number; // End timestamp of frame
        events: IEvent[];
    }

    // PROPS
    export let startTimestamp: number = -1, // TODO: Remove?
        query: Record<string, any> | Record<string, any>[] = {},
        autoFetchFuture: boolean = true,
        autoFetchFutureInterval = 1000 * 2,
        useCache = true;

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
        const sysdoc = await clientGetSysDoc(fetch);
        if (!sysdoc) {
            // TODO: FATAL
            alert("FATAL error, no system document!");
        }
        return sysdoc.latestEventTimestamp;
    }

    // HANDLERS
    function onTriggerAutoLoadFuture() {
        console.debug("InfiniteEventList: Triggered autoLoadFuture");
        loadCurrent();
    }
    async function loadPast() {
        // TODO: Fix hack to prevent load trigger from list before getting sysdoc timestamp
        if (lastPastFrameEnd.valueOf() === dayjs(0).valueOf()) return;
        if (loading || endOfData) return;
        loading = true;

        //const p_frame = clientFetchEventFrame(fetch, lastPastFrameEnd.valueOf(), query);
        //const [frame] = await Promise.allSettled([p_frame]);
        //if (!moreFrames) endOfData = true;
        const frameFetchRes = await clientGetTimeFrame(fetch, lastPastFrameEnd.valueOf(), useCache);
        if (!frameFetchRes) {
            alert(`no frame for: ${lastPastFrameEnd.format()}`);
            return;
        }
        if (frameFetchRes?.previousFrame === -1) endOfData = true;

        /*if (frameFetchRes instanceof ICac) {

        }*/

        // Fetch events in frame
        const eventFetchRes = await clientFetchAllEventsInFrame(fetch, lastPastFrameEnd.valueOf(), query);

        /*if (useCache) {
            await cacheSetTimeFrame(frameFetchRes, data.nextFrame, data.previousFrame, data.items);
        }*/

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

        lastPastFrameEnd = dayjs(frameFetchRes!.previousFrame);
        loading = false;
    }

    async function loadCurrent() {
        const currentFrameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf();
        const frame = await clientGetTimeFrame(fetch, currentFrameEnd);
        if (!frame) return;

        // Fetch events in frame
        const eventFetchRes = await clientFetchAllEventsInFrame(fetch, currentFrameEnd, query);


        // Sort events & update frames
        eventFetchRes.items.sort((a, b) => b.createdAt - a.createdAt);
        timeFrames.update(frames => {
            const i = $timeFrames.findIndex(f => f.frameEnd === currentFrameEnd);
            if (i < 0) {
                const pendingFrame = {
                    frameEnd: currentFrameEnd,
                    events: eventFetchRes.items,
                };
                frames = [pendingFrame, ...frames];
                return frames;
            }
            else {
                const oldEvents = frames[i].events;
                frames[i].events = eventFetchRes.items;
                if (oldEvents.length !== frames[i].events.length) { // TODO: needs to handle multipel db request with limit better
                    const newEvents = eventFetchRes.items.filter((e) => oldEvents.findIndex(oe => oe.key === e.key) < 0);
                    handleNewEventsNotify(newEvents);
                    // TODO: IMPL
                }
                return frames;
            }
        })
    }

    onMount(async () => {
        lastPastFrameEnd = dayjs(await getSystemLatestEventTimestamp()).endOf(TIME_FRAME_OFFSET_UNIT);
        await loadPast();
        loadCurrent();
        if (autoFetchFuture)
            autoFetchFutureTimer = setInterval(onTriggerAutoLoadFuture, autoFetchFutureInterval);
    });
    onDestroy(() => {
        autoFetchFutureTimer && clearInterval(autoFetchFutureTimer);
    });

</script>

<div bind:this={scrollEl}>
    {#each $timeFrames as frame, i}
        <div class="frame">
            <EventList events={frame.events} indexOffset={i}/>
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