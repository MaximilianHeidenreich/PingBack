<script lang="ts">
    import { cache_SetFrame, type ICachedTimeFrame } from "$lib/client/cache";
    import { client_GetTimeFrame } from "$lib/client/timeFrame";
    import type { IEvent } from "$lib/types/IEvent";
    import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
    import dayjs, { type ManipulateType } from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { get, writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";
    import { subscribeLive_newEvents, unsubscribeLive_newEvents } from "$lib/client/liveData";
    import { client_GetSysDoc } from "$lib/client/sysdoc";
    import { client_QueryEvents, client_QueryEventsAll, client_QueryEventsInFrameAll } from "$lib/client/event";

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
        useCache = false;// TOOD: Disabled, err after delete Object.keys(query).length === 0 ? true : false; // TODO!: Fix cached query

    // STATE
    let scrollEl: HTMLElement;

    let loading = false;
    let endOfData = false;
    let processing = false;
    let processingProgress: [number, number] = [0, 0]; // [current, total]
    let timeFrames = writable<IDisplayTimeFrame[]>([]);

    let lastKey: string | undefined = undefined;
    let events = writable<IEvent[]>([]);

    async function loadCurrent() {
        let newEvents = await client_QueryEvents({});
        lastKey = newEvents.last;
        events.update(old => [...old, ...newEvents.items]);
    }

    async function loadPast() {
        if (endOfData) return;
        let newEvents = await client_QueryEvents({}, undefined, lastKey);
        lastKey = newEvents.last;
        if (!lastKey) endOfData = true;
        events.update(old => [...old, ...newEvents.items]);
    }

    // Called when background fetcher has new events
    function onNewLiveEvents(newEvents: IEvent[]) {
        events.update(old => {
            if (newEvents.find(e => e.key === get(events)[0].key)) {
                // We need to only prepend new events that are not already in the list
                const newEventsFiltered = newEvents.filter(e => !old.find(e2 => e2.key === e.key));
                return [...newEventsFiltered, ...old];
            }
            else {
                // Prepend all new events.
                return [...newEvents, ...old];
            }
        });
    }

    // HOOKS
    onMount(async () => {
        await loadPast();
        loadCurrent();
        subscribeLive_newEvents(onNewLiveEvents);
    });
    onDestroy(() => {
        unsubscribeLive_newEvents(onNewLiveEvents);
    });


</script>

<div bind:this={scrollEl}>
    <EventList events={$events} />
</div>

<InfiniteEventListTrigger
    observerRoot={scrollEl}
    {loading}
    {endOfData}
    {processing}
    {processingProgress}
    on:triggerLoad={loadPast} />
