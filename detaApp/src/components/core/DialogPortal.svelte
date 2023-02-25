<script lang="ts">
    import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
    import { fade } from 'svelte/transition';
	import { TRANSITION_TOKENS } from "$lib/utils/transitions";
</script>

{#if $storeActiveDialog}
    <div class="dialogPortal" 
        transition:fade="{{ delay: 0, duration: TRANSITION_TOKENS.DURATION, easing: TRANSITION_TOKENS.EASING }}">
        <svelte:component 
            this={$storeActiveDialog}
            />
    </div>
{/if}

<style lang="postcss">
    .dialogPortal {
        @apply isolate p-4 absolute z-50 top-0 left-0 bottom-0 right-0;
        @apply flex justify-center items-center;
        @apply transition-all duration-300;
        background-color: rgba(0,0,0,0.2);
    }
</style>