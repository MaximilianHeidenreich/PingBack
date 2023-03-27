<script lang="ts">
    import "../scaffold.postcss";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import Menu from "iconsax-svelte/Menu.svelte";
    import FilterSearch from "iconsax-svelte/FilterSearch.svelte";
    import Layer from "iconsax-svelte/Layer.svelte";
    import { get } from "svelte/store";
    import { s_appSidebarCollapsed } from "../s_appSidebarCollapsed";
    import { s_headerTitle } from "./s_headerTitle";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";

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

<header class="app-area flex justify-between items-center !py-3 !px-4" class:fullwidth={$s_appSidebarCollapsed}>
    <div class="flex items-center gap-3">
        <IconButton on:click={onToggleSidebar}><Menu /></IconButton>
        <span class="text-lg font-medium">{$s_headerTitle}</span>
    </div>
    <ul class=" flex items-center gap-3">
        <li><IconButton><FilterSearch /></IconButton></li>
        <li><IconButton on:click={onToggleListStyle}><Layer /></IconButton></li>
    </ul>
</header>

<style lang="postcss">
    header {
        grid-row: 1;
        grid-column: 1 / 3;
        @apply isolate fixed top-0 left-0 right-0 mx-6 mt-6 backdrop-blur-lg bg-white/50;
    }
    @media screen and (min-width: 768px) {
        header {
            grid-row: 1;
            grid-column: 2 / -1;
            @apply mt-0 mx-0 relative ;
        }
        header.fullwidth {
            grid-column: 1 / -1;
        }
    }
</style>