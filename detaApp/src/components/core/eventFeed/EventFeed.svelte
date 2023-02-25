<script lang="ts">
	import type { IEvent } from "$lib/types/IEvent";
	import { onMount } from "svelte";
	import EventFeedItem from "./EventFeedItem.svelte";
	import EventFeedLoadMore from "./EventFeedLoadMore.svelte";

    // PROPS
    export let  events: IEvent[] | [] = [],
                canLoadMore: boolean = false,
                loadingMore: boolean = false,
                scrollPosition: number = 0;
    // TODO; Add load more button prop enable

    // STATE
    let scrollContainer: HTMLUListElement;
    let scrollContainerScrollTop: number = 0;

    // HOOKS
    onMount(() => {
        if(scrollContainer) scrollContainer.scrollTop = scrollPosition;
    })

</script>

{#if events.length <= 0}
<p class="text-center mx-auto max-w-[50ch] my-6">
    Nothing to display... <br>
    <span class="text-sm">Visit <a href="https://maximilianheidenreich.gitbook.io/pingback/" target="_blank" class="pretty-link">help</a> to learn how to publish your first event.</span>
</p>
{:else}
<ul class="eventFeed" bind:this={scrollContainer} on:scroll>
    {#each events as event}
        <EventFeedItem {event}/>
    {/each}
    <EventFeedLoadMore 
        observerRoot={scrollContainer}
        loading={loadingMore}
        done={!canLoadMore}
        on:triggerLoad/>
</ul>
{/if}

<style lang="postcss">
    ul.eventFeed {
        @apply w-full h-fit max-h-full px-0 py-4 overflow-y-auto;
        @apply flex flex-col;
    }
</style>