<script lang="ts">
    import InfiniteEventList from "$cmp/core/eventList/InfiniteEventList.svelte";
import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fly } from "svelte/transition";

</script>

<div class="filter-result"
    transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        y: -120
    }}>
    <InfiniteEventList
        startTimestamp={Date.now()}
        query={{}}/>
</div>

<style lang="postcss">
    .filter-result {
        @apply relative z-0 p-6 bg-white flex-1;
    }
</style>