<script lang="ts">
    import { ICON_TOKENS } from "$lib/utils/tokens";
    import { IconLoader } from "@tabler/icons-svelte";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    // PROPS
    export let observerRoot: HTMLElement, loading: boolean, done: boolean;

    // STATE
    const dispatch = createEventDispatcher();
    let triggerEl: HTMLDivElement;
    let observer: IntersectionObserver;

    // HOOKS
    onMount(() => {
        observer = new IntersectionObserver(
            (entries) => {
                const target = entries.find((e) => e.target === triggerEl);
                if (!target) return;

                if (target.isIntersecting) {
                    dispatch("triggerLoad", {});
                }
            },
            { root: observerRoot, threshold: 0 }
        );
        observer.observe(triggerEl);
    });
    onDestroy(() => {
        observer.disconnect();
    });
</script>

<div
    bind:this={triggerEl}
    class="mt-4 mb-6 flex w-full flex-col items-center justify-center gap-2">
    {#if done}
        <span class="text-sm text-neutral-500">No more data</span>
    {:else if loading}
        <span class="animate-spin"
            ><IconLoader
                size={ICON_TOKENS.SIZE.SM}
                stroke={ICON_TOKENS.STROKE.BASE} /></span>
        <span class="text-sm text-neutral-500">Loading, please wait.</span>
    {:else}
        <span class="text-sm text-neutral-500" />
    {/if}
</div>
