<script lang="ts">
    import type { IEvent } from "@pingback/shared";
    import EventList from "../EventList.svelte";

    // PROPS
    export let events: IEvent[];

</script>

<EventList bind:events/>
