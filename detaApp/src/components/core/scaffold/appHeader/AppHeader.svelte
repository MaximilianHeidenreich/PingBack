<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import FilterSearch from "iconsax-svelte/FilterSearch.svelte";
    import Layer from "iconsax-svelte/Layer.svelte";
    import Menu from "iconsax-svelte/Menu.svelte";
    import { get } from "svelte/store";
    import { fly } from "svelte/transition";
    import "../scaffold.postcss";
    import { s_appSidebarCollapsed } from "../s_appSidebarCollapsed";
    import FilterInput from "./FilterInput.svelte";
    import { s_filter } from "./s_filter";
    import { s_headerTitle } from "./s_headerTitle";

    // STATE
    let filterOpen = false;

    // HANDLERS
    function onToggleSidebar() {
        s_appSidebarCollapsed.set(!get(s_appSidebarCollapsed));
    }
    function onToggleListStyle() {
        const curr = get(s_eventListStyle);
        if (curr === "compact") s_eventListStyle.set("card");
        else if (curr === "card") s_eventListStyle.set("compact");
    }
</script>

<div class="header-wrapper" class:fullwidth={$s_appSidebarCollapsed}>
    <header
        class="app-area flex items-center justify-between !py-3 !px-4">
        <div class="flex items-center gap-3">
            <IconButton on:click={onToggleSidebar}><Menu /></IconButton>
            <span class="text-lg font-medium">{$s_headerTitle}</span>
        </div>
        <ul class="flex items-center gap-3">
            <li><IconButton on:click={() => filterOpen = !filterOpen}><FilterSearch /></IconButton></li>
            <li><IconButton on:click={onToggleListStyle}><Layer /></IconButton></li>
        </ul>
    </header>

    {#if filterOpen}
    <div class="filter-wrapper app-area"
        in:fly={{
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING,
            y: -50
        }}
        out:fly={{
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING,
            y: -50
        }}>
        <div class="flex items-center gap-2 mb-4 text-sm">
            <span class="font-semibold">Filter</span>
            <span class="font-bold">·</span>
            <span><a href="/docs" class="pretty-link">Help</a></span> <!-- TODO! Add right link -->
        </div>
        <FilterInput on:filterChanged={(e) => s_filter.set(e.detail)} />
    </div>
    {/if}
</div>

<style lang="postcss">
    .header-wrapper {
        grid-row: 1;
        grid-column: 1 / 3;
        @apply isolate fixed top-0 left-0 right-0 mx-6 mt-6;
    }
    header {
        @apply relative z-20 bg-white/50 backdrop-blur-lg;
    }
    @media screen and (min-width: 768px) {
        .header-wrapper {
            grid-row: 1;
            grid-column: 2 / -1;
            @apply relative mx-0 mt-0;
        }
        header {

            @apply relative;
        }
        .header-wrapper.fullwidth {
            grid-column: 1 / -1;
        }
    }

    .filter-wrapper {
        @apply relative z-0 mx-4 -mt-4 p-4 pt-7 px-6;
        @apply rounded-t-none;
    }
</style>

