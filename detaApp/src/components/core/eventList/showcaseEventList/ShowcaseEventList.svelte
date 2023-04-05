<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";
    import EventList from "../EventList.svelte";

    // PROPS
    export let events: IEvent[];

</script>

<EventList bind:events/>
