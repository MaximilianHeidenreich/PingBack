<script lang="ts">
	import type { IEvent } from "$lib/types/IEvent";
	import EventFeedItem from "./EventFeedItem.svelte";

    // PROPS
    export let  events: IEvent[] | [] = [];
    // TODO; Add load more button prop enable

</script>

{#if events.length <= 0}
<p class="text-center mx-auto max-w-[50ch]">
    Nothing to display... <br>
    <span class="text-sm">Visit <a href="/" class="pretty-link">help</a> to learn how to publish your first event.</span>
</p>
{:else}
<ul class="eventFeed">
    {#each events as event}
        <EventFeedItem {event}/>
    {/each}
</ul>
{/if}

<style lang="postcss">
    ul.eventFeed {
        @apply w-full h-fit max-h-full px-6 py-4 overflow-y-auto flex flex-col;
    }
</style>