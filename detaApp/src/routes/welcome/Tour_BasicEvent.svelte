<script lang="ts">
    import { CodeBlock } from "svhighlight";
    import EventListItem from "$cmp/core/eventList/EventListItem.svelte";
    import type { IEvent } from "$lib/types/IEvent";
    import { quintOut } from "svelte/easing";
    import TourHeader from "./TourHeader.svelte";
    import TourStep from "./TourStep.svelte";
    import { scale } from "svelte/transition";
    import { getContext, onDestroy, onMount } from "svelte";
    import { clientFetchAllEventsInFrame } from "$lib/helpers/api/eventClient";
    import dayjs from "dayjs";
    import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";
    import type { IApiKey } from "$lib/types/IApiKey";

    // STATE
    let displayEvent: IEvent | undefined;
    let refreshTimer: NodeJS.Timer | undefined;
    let defaultApiKey = getContext<IApiKey | undefined>("default_apiKey");

    const code_cURL = `
curl --location --request POST "${window.location.origin}/api/v1/events" \\
\t--header "X-API-Key: ${defaultApiKey ? defaultApiKey.key : 'error_no_default_found'}" \\
\t--header "Content-Type: application/json" \\
\t--data-raw '{
    "project": "default",
    "channel": "default",
    "name": "test.event",
    "title": "Hello from cURL",
    "description": "Welcome to PingBack",
    "icon": "🚀"
}'
    `; // TODO: Insert default api key
    
    // HANDLERS
    async function onRefresh() {
        console.debug("[Tour] Refreshing live event display ...");

        let eventsRes;
        try {
            eventsRes = await clientFetchAllEventsInFrame(fetch, dayjs().endOf(TIME_FRAME_OFFSET_UNIT).valueOf(), { "createdAt?gte": dayjs().subtract(4, "s").valueOf() }, false);
        } catch (e) {
            console.error(e);
            return;
        }

        eventsRes.items.sort((a, b) => b.createdAt - a.createdAt);
        if (eventsRes.items.length > 0) {
            displayEvent = eventsRes.items[0];
            refreshTimer && clearInterval(refreshTimer);
        }
    }

    // HOOKS
    onMount(() => refreshTimer = setInterval(onRefresh, 2000));
    onDestroy(() => refreshTimer && clearInterval(refreshTimer));

    s_eventListStyle.set("compact");

</script>

<TourStep>
    <svelte:fragment slot="header">
        <TourHeader>
            <svelte:fragment slot="title">
                Your first <span class="text-pink-500">event</span>.
            </svelte:fragment>
            <svelte:fragment slot="description">
                To submit and event, you simply need to call a single HTTP endpoint. Alternatively, you can use 
                one of the provided client SDK's for your programming language to get started. Each submission needs to be authenticated with an <b>API key</b>.
                We've generated a default one for you to use in the following snippets but you can create / delete them inside the "projects" page.
                Copy the code snippet below into your terminal / IDE, run it and see you event pop up.
            </svelte:fragment>
        </TourHeader>
    </svelte:fragment>

    <div class="wrapper flex-1 h-full flex flex-col items-stretch">
        <div class="preview {displayEvent ? 'filled' : 'empty text-center'}">
            {#if displayEvent}
            <ul class="rounded-2xl overflow-hidden border-2 shadow-xl"
                transition:scale="{{ duration: 500, opacity: 0.2, start: 0.4, easing: quintOut }}">
                <EventListItem event={displayEvent}/>
            </ul>
            {:else}
            <span class="font-mono text-neutral-400 text-sm">Waiting for a new event...</span>
            {/if}
        </div>

        <div>
            <p>cURL</p>
            <CodeBlock code={code_cURL} language="bash" /> <!-- TODO: Add highlightying -->
        </div>
        <!--{#if !displayEvent}
        {:else}
        <div class="text-center flex-1 bg-red-50">
            <span>🎉 It worked!</span>
        </div>
        {/if}-->
    </div>

</TourStep>

<style lang="postcss">
    .preview {
        @apply max-w-lg mx-auto min-w-[40ch] px-4 py-2 rounded-2xl mb-6;
    }
    .preview.empty {
        @apply border-2 border-dashed;
    }
</style>
