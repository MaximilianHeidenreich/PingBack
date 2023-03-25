<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";
    import EventListItem from "./EventListItem.svelte";


    // PROPS
    export let events: IEvent[];
</script>

<ul>
    {#each events as event, i}
        <EventListItem
            {event}/>
    {/each}
</ul>

<style lang="postcss">
    ul {
        @apply flex-1 flex flex-col;
    }
</style>