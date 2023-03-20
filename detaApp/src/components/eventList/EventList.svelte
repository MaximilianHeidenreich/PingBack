<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";
    import EventListItem from "./EventListItem.svelte";

    // PROPS
    export let events: IEvent[]
        // odd={ (i === 0 ? oddOffset + 1 : i + 1) % 2 !== 0}
</script>

<ul>
    {#each events as event, i}
        <EventListItem
            {event}
            odd={i % 2 !== 0} />
    {/each}
</ul>

<style lang="postcss">
    ul {
        @apply flex flex-1 flex-col;
    }
</style>
