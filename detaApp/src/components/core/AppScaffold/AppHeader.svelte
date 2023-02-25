<script lang="ts">
	import { storeFeedStyle } from "$lib/stores/storeFeedStyle";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
	import { storeSidebarOpen } from "$lib/stores/storeSidebarOpen";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { IconMenu2, IconRefresh, IconSearch, IconStack2 } from "@tabler/icons-svelte";
	import { get } from "svelte/store";
    import IconButton from "../buttons/IconButton.svelte";

    // HANDLERS
    function onToggleSidebar() {
        storeSidebarOpen.set(!get(storeSidebarOpen));
    }

    function onToggleFeedStyle() {
        if (get(storeFeedStyle) === "card") storeFeedStyle.set("compact-list");
        else if (get(storeFeedStyle) === "compact-list") storeFeedStyle.set("card");
    }

</script>

<header>
    <div class="flex items-center gap-3">
        <div class="sidebar-toggle">
            <IconButton on:click={onToggleSidebar}>
                <IconMenu2 slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/>
            </IconButton>
        </div>
        <span class="page-title">{$storePageHeaderTitle}</span>
    </div>
    <ul class="flex items-center gap-1">
        <li><IconButton><IconSearch slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
        <li><IconButton on:click={onToggleFeedStyle}><IconStack2 slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
        <li><IconButton><IconRefresh slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
    </ul>
</header>

<style lang="postcss">
    header {
        @apply w-full p-6 border-b-2 border-neutral-100;
        @apply flex items-center justify-between;
    }
    header .page-title {
        @apply text-xl font-medium;
    }

    .sidebar-toggle {
        @apply hidden;
    }

    @media screen and (max-width: 768px) {
        header {
            @apply p-4;
        }
        header .page-title {
            @apply text-base font-medium;
        }
        .sidebar-toggle {
            @apply block;
        }
    }
</style>