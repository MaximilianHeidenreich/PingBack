<script lang="ts">
	import EventFeed from "./EventFeed.svelte";
    import dayjs, { Dayjs } from "dayjs";
	import type { IEvent } from "$lib/types/IEvent";
	import { fetchAllEvents, fetchEvents, singleFetchEvents } from "$lib/api/apiEvents";
	import { get } from "svelte/store";
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import { storeRefreshButton, storeRefreshing } from "$lib/stores/storeRefreshButton";
	import { onMount } from "svelte";

    // PROPS
    export let  query: object = {};

    // STATE
    let lastScrollPosition: number = 200;

    let eventGroups: IEvent[][] = [];   // We split events into their individual groups from fetching -> We only need to sort the latest group
    let nextTimestampEnd: Dayjs = dayjs();
    let lastTimestampEnd: Dayjs = dayjs();

    let canFetchMorePrevious = true;
    let canFetchMoreNext = true;
    let isLoadingPrevious = false;

    $: { console.log("Evnet Groups:",eventGroups); }
    $: { $storeRefreshButton; (async () => { 
        await loadNext();
        storeRefreshing.set(false);
        canFetchMoreNext = true;
    })(); }

    // TODO: First fetch from store last event timestamp
    // TODO: on event push -> channels set last event timestamp
    
    // FUNC
    async function loadPrevious() {
        if (!canFetchMorePrevious) return;
        if (!get(storeActiveProject)) return; // TODO: notify
        isLoadingPrevious = true;
        
        const tEnd = lastTimestampEnd;
        const tStart = tEnd.subtract(12, "hour");

        let newEvents = await fetchAllEvents({
            ...query,
            //project: get(storeActiveProject)!.id,
            //channel: "test",
            "createdAt?r": [tStart.valueOf(), tEnd.valueOf()]
        });
        let previousEvents = await singleFetchEvents({
            ...query,
            //"project": get(storeActiveProject)!.id,
            //"channel": "test",
            "createdAt?lte": tStart.valueOf()
        })

        if (previousEvents.data!.count <= 0 && !previousEvents.data!.last) {
            // No more data to fetch
            canFetchMorePrevious = false;
        }

        if (newEvents.length <= 0 && canFetchMorePrevious) {
            // No new events, auto retry
            // Reduce timestamp by 1/2 day for next fetch.
            lastTimestampEnd = lastTimestampEnd.subtract(12, "hour");
            await loadPrevious();
            return;
        }        

        // Sort events & append to end
        newEvents.sort((a, b) => b.createdAt - a.createdAt);
        eventGroups.push(newEvents);
        eventGroups = eventGroups;

        // Reduce timestamp by 1/2 day for next fetch.
        lastTimestampEnd = lastTimestampEnd.subtract(12, "hour");
        isLoadingPrevious = false;
    }

    async function loadNext() {
        if (!canFetchMoreNext) return;
        if (!get(storeActiveProject)) return; // TODO: notify        
        
        const tStart = nextTimestampEnd;
        const tEnd = tStart.add(12, "hour");

        let newEvents = await fetchAllEvents({
            ...query,
            //project: get(storeActiveProject)!.id,
            //channel: "test",
            "createdAt?r": [tStart.valueOf(), tEnd.valueOf()]
        });
        let nextEvents = await singleFetchEvents({
            ...query,
            //"project": get(storeActiveProject)!.id,
            //"channel": "test",
            "createdAt?gt": tEnd.valueOf()
        })

        if (nextEvents.data!.count <= 0 && !nextEvents.data!.last) {
            // No more data to fetch
            canFetchMoreNext = false;
        }

        if (newEvents.length <= 0 && canFetchMoreNext) {
            // No new events, auto retry
            // Reduce timestamp by 1/2 day for next fetch.
            nextTimestampEnd = nextTimestampEnd.add(12, "hour");
            await loadNext();
            return;
        }        

        // Sort events & prepend
        newEvents.sort((a, b) => b.createdAt - a.createdAt);
        eventGroups = [newEvents, ...eventGroups];

        // Reduce timestamp by 1/2 day for next fetch.
        nextTimestampEnd = dayjs(); // TODO: bug prevent multiple loading of newest //dayjs(newEvents[0].createdAt);
        storeRefreshing.set(false);
    }

    // HANDLERS
    function handleScroll() {
        console.log();
        
    }

    function onTriggerLoad() {
        loadPrevious();
    }

    // HOOKS
    onMount(() => {
        loadPrevious();
    });

</script>

{#key eventGroups}
{#key canFetchMorePrevious}
<EventFeed 
    events={eventGroups.flat(1)} 
    canLoadMore={canFetchMorePrevious} 
    loadingMore={isLoadingPrevious}
    scrollPosition={lastScrollPosition}
    on:triggerLoad={onTriggerLoad}
    on:scroll={handleScroll}/>
{/key}
{/key}
