<script lang="ts">
    import { storeActiveProject } from "$lib/stores/storeActiveProject";
    import { storeAppProjectMenuOpen } from "$lib/stores/storeAppProjectMenuOpen";
    import { storeSidebarOpen } from "$lib/stores/storeSidebarOpen";
    import { TRANSITION_TOKENS } from "$lib/utils/transitions";

    import { fade, fly } from "svelte/transition";

    import AppMainMenu from "./MainMenu/AppMainMenu.svelte";
    import AppProjectMenu from "./ProjectMenu/AppProjectMenu.svelte";

    // STATE
    $: activeProject = $storeActiveProject;
</script>

{#if $storeSidebarOpen}
    <div
        class="sidebar-bg"
        on:click={() => storeSidebarOpen.set(false)}
        transition:fade={{
            duration: TRANSITION_TOKENS.DURATION + 100,
            easing: TRANSITION_TOKENS.EASING
        }} />
{/if}
{#if $storeSidebarOpen}
    <div
        class:open={$storeSidebarOpen}
        class="app-sidebar-wrapper"
        transition:fly={{
            duration: TRANSITION_TOKENS.DURATION,
            easing: TRANSITION_TOKENS.EASING,
            x: -100
        }}>
        <aside class:open={$storeSidebarOpen}>
            <AppMainMenu />
        </aside>
        {#if $storeAppProjectMenuOpen && activeProject}
            <AppProjectMenu project={activeProject} />
        {/if}
    </div>
{/if}

<style lang="postcss">
    .app-sidebar-wrapper {
        @apply isolate flex h-full max-h-full;
    }
    .sidebar-bg {
        @apply hidden;
    }
    aside {
        @apply z-50 block h-full max-h-full bg-white;
        grid-row: 1;
        grid-column: 1;
    }

    /* Mobile */
    @media screen and (max-width: 768px) {
        .app-sidebar-wrapper {
            @apply absolute top-0 left-0;
        }
        .sidebar-bg {
            @apply absolute top-0 left-0 bottom-0 right-0 block;
            @apply bg-black bg-opacity-50;
        }
    }
</style>
