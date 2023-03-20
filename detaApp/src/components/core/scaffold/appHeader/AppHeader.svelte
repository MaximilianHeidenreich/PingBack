<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { s_eventListStyle } from "$cmp/eventList/s_eventListStyle";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconMenu2, IconRefresh, IconSearch, IconStack2 } from "@tabler/icons-svelte";
    import { get } from "svelte/store";
    import { s_appSidebarCollapsed } from "../s_appSidebarCollapsed";
    import SearchBar from "./SearchBar.svelte";
    import { s_headerLoading } from "./s_headerLoading";
    import { s_headerTitle } from "./s_headerTitle";
    import { s_refresh } from "./s_refresh";

    // STATE
    let searchOpen = false;

    // HANDLERS
    function onToggleSidebar() {
        s_appSidebarCollapsed.set(!get(s_appSidebarCollapsed));
    }
    function onEnterSearch() {
        searchOpen = true;
    }
    function onCloseSearch() {
        searchOpen = false;
    }
    function onToggleListStyle() {
        const curr = get(s_eventListStyle);
        if (curr === "compact") s_eventListStyle.set("card");
        else if (curr === "card") s_eventListStyle.set("compact");
    }
    function onRefresh() {
        s_refresh.update((v) => !v);
    }
</script>

<header>
    <IconButton on:click={onToggleSidebar}>
        <IconMenu2
            size={TKN_ICON.SIZE.BASE}
            stroke={TKN_ICON.STROKE.BASE} />
    </IconButton>
    <div class="flex flex-1 grow items-center justify-between">
        {#if !searchOpen}
            <span class="page-title">{$s_headerTitle}</span>
        {/if}
        <ul class="flex flex-1 grow items-center justify-end gap-2">
            <li class={searchOpen ? "flex-1" : ""}>
                {#if searchOpen}
                    <SearchBar on:close={onCloseSearch} />
                {:else}
                    <IconButton on:click={onEnterSearch}>
                        <IconSearch
                            size={TKN_ICON.SIZE.BASE}
                            stroke={TKN_ICON.STROKE.BASE} />
                    </IconButton>
                {/if}
            </li>
            <li>
                <IconButton on:click={onToggleListStyle}>
                    <IconStack2
                        size={TKN_ICON.SIZE.BASE}
                        stroke={TKN_ICON.STROKE.BASE} />
                </IconButton>
            </li>
            <li>
                {#key $s_refresh}
                    <IconButton on:click={onRefresh}>
                        {#key $s_headerLoading}
                            <IconRefresh
                                size={TKN_ICON.SIZE.BASE}
                                stroke={TKN_ICON.STROKE.BASE}
                                class={get(s_headerLoading) ? "animate-spin" : ""}
                                style="animation-direction: reverse;" />
                        {/key}
                    </IconButton>
                {/key}
            </li>
        </ul>
    </div>
</header>

<style lang="postcss">
    header {
        @apply flex w-full items-center justify-start gap-4 p-5;
        @apply border-b-4 border-neutral-100 bg-white;
    }
    .page-title {
        @apply text-xl font-medium;
    }
</style>
