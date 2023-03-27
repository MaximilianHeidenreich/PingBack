<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";
    import EventListItem from "./EventListItem.svelte";


    // PROPS
    export let events: IEvent[],
        indexOffset: number = 0;
</script>

<ul>
    {#each events as event, i}
        <EventListItem
            {event}
            odd={(indexOffset + i) % 2 !== 0}/>
    {/each}
</ul>

<style lang="postcss">
    ul {
        @apply flex-1 flex flex-col;
    }
</style>