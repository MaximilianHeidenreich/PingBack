<script lang="ts">
    import { clientFetchProjectEventFrame, clientFetchProjectEventsRaw } from "$lib/helpers/api/eventClient";
    import type { IEvent } from "$lib/types/IEvent";
    import type { IProject } from "$lib/types/IProject";
    import type { Dayjs } from "dayjs";
    import dayjs from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";

    // TYPES
    type IFrame = {
        frameEnd: number; // Beginning Timestamp of frame
        events: IEvent[];
    }

    // PROPS
    export let project: IProject,
        startTimestamp: number = Date.now(),
        query: Record<string, any> | Record<string, any>[] = {},
        autoFetchFuture: boolean = false,
        autoFetchFutureInterval = 1000 * 5;

    // STATE
    let scrollEl: HTMLElement;
    let autoFetchFutureTimer: NodeJS.Timer | undefined;

    let loading = false;
    let endOfData = false; // ->
    let processing = false; // True while sorting new events
    let processingProgress: [number, number] = [0, 0]; // [current, total]
    let eventFrames = writable<IFrame[]>([]);

    let lastPastFrame: Dayjs = dayjs(startTimestamp || project.latestEventTimestamp || Date.now()).endOf("hour"); // TODO: can remove project latest
    let lastFutureFrame: Dayjs = dayjs(startTimestamp || project.latestEventTimestamp || Date.now());

    // FN
    // TODO: make param lastPastFrame -> Parallel fetch 5 frames
    async function loadPast() {
        if (loading || endOfData) return;
        loading = true; // TODO: Try reset on throw

        let fetchedEvents: IEvent[] = [];
        let lastKey: string | undefined;

        // Fetch events
        // TODO !!: Retry when empty but more events
        let [res, more] = await clientFetchProjectEventFrame(
            fetch,
            project.key,
            lastPastFrame.valueOf(),
            query,
            true,
            lastKey
        );
        fetchedEvents = res.items;
        if (!more) endOfData = true;

        // Sort events & update frames
        processingProgress = [0, fetchedEvents.length]
        processing = true;
        fetchedEvents.sort( (a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        eventFrames.update(frames => {
            const pendingFrame = {
                frameEnd: lastPastFrame.startOf("hour").valueOf(),
                events: fetchedEvents
            };
            frames.push(pendingFrame);
            return frames;
        });

        lastPastFrame = lastPastFrame.subtract(1, "hour");
        loading = false;
    }

    async function loadFuture() { /* TODO: impl */ }

    // HANDLERS
    function onLoadPast() {
        loadPast();
    }
    function onAutoLoadTrigger() {
        console.log("Infinite event list: Auto load trigger!");
        //s_headerLoading.set(true);
        //loadFuture().then(() => s_headerLoading.set(false));
        //s_headerLoading.set(false);
    }

    // HOOKS
    onMount(async () => {
        await loadPast();
        if (autoFetchFuture) autoFetchFutureTimer = setInterval(onAutoLoadTrigger, autoFetchFutureInterval);
    });
    onDestroy(() => {
        autoFetchFutureTimer && clearInterval(autoFetchFutureTimer);
    })

</script>

<div bind:this={scrollEl}>
    {#each $eventFrames as frame}
        <div class="frame">
            <EventList events={frame.events} />
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

