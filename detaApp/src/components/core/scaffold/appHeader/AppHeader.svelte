<script lang="ts">
    import { navigating } from "$app/stores";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import { IconMenu2, IconFilter, IconStack2, IconFilterOff } from "@tabler/icons-svelte";
    import { get } from "svelte/store";
    import { fly } from "svelte/transition";
    import { s_appSidebarCollapsed } from "../s_appSidebarCollapsed";
    import FilterBar from "./FilterBar.svelte";
    import SearchBar from "./FilterBar.svelte";
    import FilterResultView from "./FilterResultView.svelte";
    import { s_headerTitle } from "./s_headerTitle";
    import { s_refresh } from "./s_refresh";

    // STATE
    let filterOpen = false;
    let filterQuery = {};

    $: navigating: {
        $navigating;
        filterOpen = false;
    }

    // HANDLERS
    function onToggleSidebar() {
        s_appSidebarCollapsed.set(!get(s_appSidebarCollapsed));
    }
    function onToggleFilter() {
        filterOpen = !filterOpen;
    }
    function onToggleListStyle() {
        const curr = get(s_eventListStyle);
        if (curr === "compact") s_eventListStyle.set("card");
        else if (curr === "card") s_eventListStyle.set("compact");
    }
</script>

<header class="{filterOpen ? 'h-full flex flex-col' : ''}">
    <div class="controls">
        <IconButton on:click={onToggleSidebar}>
            <IconMenu2
                size={TKN_ICON.SIZE.BASE}
                stroke={TKN_ICON.STROKE.BASE} />
        </IconButton>
        <div class="flex flex-1 grow items-center justify-between">
            <span class="page-title">{$s_headerTitle}</span>
            <ul class="flex flex-1 grow items-center justify-end gap-2">
                <li>
                    <IconButton on:click={onToggleFilter}>
                        {#if !filterOpen}
                        <IconFilter
                            size={TKN_ICON.SIZE.BASE}
                            stroke={TKN_ICON.STROKE.BASE} />
                        {:else}
                        <IconFilterOff
                            size={TKN_ICON.SIZE.BASE}
                            stroke={TKN_ICON.STROKE.BASE} />
                        {/if}
                    </IconButton>
                </li>
                <li>
                    <IconButton on:click={onToggleListStyle}>
                        <IconStack2
                            size={TKN_ICON.SIZE.BASE}
                            stroke={TKN_ICON.STROKE.BASE} />
                    </IconButton>
                </li>
            </ul>
        </div>
    </div>
    {#if filterOpen}
    <FilterBar query={filterQuery}/>
    <FilterResultView query={filterQuery}/>
    {/if}
</header>

<style lang="postcss">
    header {
        @apply isolate;
        /*@apply flex w-full items-center justify-start gap-4 p-5;
        @apply border-b-4 border-neutral-100 bg-white;*/
    }
    header .controls {
        @apply relative z-20;
        @apply flex items-center gap-4 p-4;
        @apply bg-white border-b-4 border-neutral-100;
    }
    .page-title {
        @apply text-xl font-medium;
    }
</style>
