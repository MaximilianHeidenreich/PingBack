<script lang="ts">
    import { s_refresh } from "$cmp/core/scaffold/appHeader/s_refresh";
    import {
        clientFetchProjectEventFrame
    } from "$lib/helpers/api/eventClient";
    import type { IEvent } from "$lib/types/IEvent";
    import type { IProject } from "$lib/types/IProject";
    import toastOptions from "$lib/utils/toast";
    import type { Dayjs } from "dayjs";
    import dayjs from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import toast from "svelte-french-toast";
    import { writable } from "svelte/store";
    import EventList from "./EventList.svelte";
    import EventListItem from "./EventListItem.svelte";
    import InfiniteEventListTrigger from "./InfiniteEventListTrigger.svelte";

    // TYPES
    type IFrame = {
        frameEnd: number; // Beginning Timestamp of frame
        events: IEvent[];
    };

    // PROPS
    export let project: IProject,
        startTimestamp: number = Date.now(),
        query: Record<string, any> | Record<string, any>[] = {},
        autoFetchFuture: boolean = true,   // TODO: Make setting
        autoFetchFutureInterval = 1000 * 10; // TODO: Make setting

    // STATE
    let scrollEl: HTMLElement;
    let autoFetchFutureTimer: NodeJS.Timer | undefined;

    let loading = false;
    let endOfData = false; // ->
    let processing = false; // True while sorting new events
    let processingProgress: [number, number] = [0, 0]; // [current, total]
    let eventFrames = writable<IFrame[]>([]);

    let lastPastFrame: Dayjs = dayjs(
        startTimestamp || project.latestEventTimestamp || Date.now()
    ).endOf("hour").subtract(1, "hour"); // TODO: can remove project latest

    $: s_refresh: {
        $s_refresh;
        console.debug("Infinite event list: Refreshing!");
        (async () => {
            await loadCurrent();
        })();
    }

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
        processingProgress = [0, fetchedEvents.length];
        processing = true;
        fetchedEvents.sort((a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        eventFrames.update((frames) => {
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

    /**
     * Loads the current event frame.
     */
    async function loadCurrent() {
        let fetchedEvents: IEvent[] = [];
        let lastKey: string | undefined;
        let currentFrameEnd = dayjs().endOf("hour");

        // Fetch events
        // TODO !!: Retry when empty but more events
        let [res, more] = await clientFetchProjectEventFrame(
            fetch,
            project.key,
            currentFrameEnd.valueOf(),
            query,
            false,
            lastKey // TODO: Fetch multiple
        );
        fetchedEvents = res.items;


        // Sort events & update frames
        processingProgress = [0, fetchedEvents.length];
        processing = true;
        fetchedEvents.sort((a, b) => {
            processingProgress = [processingProgress[0] + 1, processingProgress[1]];
            return b.createdAt - a.createdAt;
        });
        processing = false;

        eventFrames.update((frames) => {
            const i = $eventFrames.findIndex((frame) => frame.frameEnd === currentFrameEnd.valueOf());
            if (i < 0) {
                const pendingFrame = {
                    frameEnd: currentFrameEnd.valueOf(),
                    events: fetchedEvents
                };
                frames = [pendingFrame, ...frames];
                return frames;
            }
            else {
                const oldEvents = frames[i].events;
                frames[i].events = fetchedEvents;
                if (oldEvents.length !== frames[i].events.length) { // TODO: needs to handle multipel db request with limit better
                    const newEvents = fetchedEvents.filter((e) => oldEvents.findIndex(oe => oe.key === e.key) < 0);
                    onNewEvents(newEvents);
                }
                return frames;
            }
        });
    }

    // HANDLERS
    function onNewEvents(events: IEvent[]) {
        console.debug("Infinite event list: New events!", events);
        if (events.length > 4) {
            toast(`${events.length} new events!`, toastOptions({
                icon: "🔔"
            }));
        }
        else {
            events.forEach((e) => {
                toast(`${e.title}`, toastOptions({
                    icon: e.icon
                }));
                /*toast(EventListItem, toastOptions({
                    icon: "🔔",
                }));*/
                /*toast(EventListItem, {
                    // @ts-ignore asd
                    foo: "bar"
                });*/ // TODO: Custom toast renderable in matching style
            });
        }
    }
    function onLoadPast() {
        loadPast();
    }
    function onAutoLoadTrigger() {
        console.debug("Infinite event list: Auto load trigger!");
        s_refresh.update((v) => !v);
    }

    // HOOKS
    onMount(async () => {
        await loadPast();
        if (autoFetchFuture)
            autoFetchFutureTimer = setInterval(onAutoLoadTrigger, autoFetchFutureInterval);
    });
    onDestroy(() => {
        autoFetchFutureTimer && clearInterval(autoFetchFutureTimer);
    });
</script>

<div bind:this={scrollEl}>
    {#each $eventFrames as frame, i}
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
    on:loadPast={onLoadPast} />
