<script lang="ts">
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fade } from "svelte/transition";
    import { s_activeModals } from "./modalStore";
</script>

<div>
    {#each $s_activeModals as [modal, props]}
        <div
            class="dialog-wrapper"
            transition:fade={{
                delay: 0,
                duration: TKN_TRANSITION.DURATION,
                easing: TKN_TRANSITION.EASING
            }}>
            <svelte:component
                this={modal}
                {...props} />
        </div>
    {/each}
</div>

<style lang="postcss">
    .dialog-wrapper {
        @apply absolute top-0 left-0 bottom-0 right-0 isolate z-50 p-4;
        @apply flex items-center justify-center;
        @apply transition-all duration-300;
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
