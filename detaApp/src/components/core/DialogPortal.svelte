<script lang="ts">
    import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
    import { TRANSITION_TOKENS } from "$lib/utils/transitions";

    import { fade } from "svelte/transition";
</script>

{#if $storeActiveDialog}
    <div
        class="dialogPortal"
        transition:fade={{
            delay: 0,
            duration: TRANSITION_TOKENS.DURATION,
            easing: TRANSITION_TOKENS.EASING
        }}>
        <svelte:component this={$storeActiveDialog} />
    </div>
{/if}

<style lang="postcss">
    .dialogPortal {
        @apply absolute top-0 left-0 bottom-0 right-0 isolate z-50 p-4;
        @apply flex items-center justify-center;
        @apply transition-all duration-300;
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
