<script lang="ts">
    import { clientFetchProjectEventsRaw } from "$lib/helpers/api/eventClient";
    import type { IEvent } from "$lib/types/IEvent";
    import type { Dayjs } from "dayjs";
    import dayjs from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";

    // TYPES
    type IBucket = {
        bucket: number; // Beginning Timestamp of bucket
        events: IEvent[];
    }

    // PROPS
    export let startTimestamp: number = Date.now(),
        autoFetchFuture: boolean = false,
        autoFetchFutureInterval = 1000 * 5;

    // STATE
    let scrollEl: HTMLElement;
    let autoFetchFutureTimer: NodeJS.Timer | undefined;

    let loading = false;
    let endOfData = false; // ->
    let processing = false; // True while sorting new events
    let processingProgress: [number, number] = [0, 0]; // [current, total]
    let eventBuckets = writable<IBucket[]>([]);

    let lastPastBucket: Dayjs = dayjs(startTimestamp).endOf("hour");
    let lastFutureBucket: Dayjs = dayjs(startTimestamp);

    // FN
    // TODO: make param lastPastBucket -> Parallel fetch 5 buckets
    async function loadPast() {
        if (loading || endOfData) return;
        loading = true; // TODO: Try reset on throw
        console.log(`Loading past bucket from ${lastPastBucket}`);

        let fetchedEvents: IEvent[] = [];
        let lastKey: string | undefined;

        // Fetch events
        // TODO !!: Retry when empty but more events
        const p_fetchEvents = clientFetchProjectEventsRaw(fetch, "test-project", {
            "createdAt?r": [lastPastBucket.startOf("hour").valueOf(), lastPastBucket.endOf("hour").valueOf()]
        }, lastKey);
        const p_moreEvents = clientFetchProjectEventsRaw(fetch, "test-project", {
            "createdAt?lt": lastPastBucket.startOf("hour").subtract(1, "hour").endOf("hour").valueOf()
        }, undefined, 1);   // Try to fetch 1 previous event -> if none -> no more events
        let [res, moreEventsRes] = await Promise.all([p_fetchEvents, p_moreEvents]);  // TODO: throws?

        fetchedEvents = res.items;
        lastKey = res.last;
        if (moreEventsRes.count <= 0) endOfData = true;
        while (lastKey) {
            res = await clientFetchProjectEventsRaw(fetch, "test-project", {
                "createdAt?r": [lastPastBucket.startOf("hour").valueOf(), lastPastBucket.endOf("hour").valueOf()]
            }, lastKey)
            fetchedEvents = fetchedEvents.concat(res.items);
            lastKey = res.last;
        }

        // Sort events & update buckets
        processingProgress = [0, fetchedEvents.length]
        processing = true;
        fetchedEvents.sort( (a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        eventBuckets.update(buckets => {
            buckets.push({
                bucket: lastPastBucket.startOf("hour").valueOf(),
                events: fetchedEvents
            });
            return buckets;
        });

        lastPastBucket = lastPastBucket.subtract(1, "hour");
        loading = false;
    }

    function loadFuture() {}

    // HANDLERS
    function onLoadPast() {
        loadPast();
    }

    // HOOKS
    onMount(async () => {
        await loadPast();
        if (autoFetchFuture) autoFetchFutureTimer = setInterval(loadFuture, autoFetchFutureInterval);
    });
    onDestroy(() => {
        autoFetchFutureTimer && clearInterval(autoFetchFutureTimer);
    })

</script>

<div bind:this={scrollEl}>
    {#each $eventBuckets as bucket}
        <div class="bucket">
            <EventList events={bucket.events} />
        </div>
    {/each}
</div>

<InfiniteEventListTrigger
    observerRoot={scrollEl}
    {loading}
    {endOfData}
    {processing}
    {processingProgress}
    on:loadPast={onLoadPast}/>

