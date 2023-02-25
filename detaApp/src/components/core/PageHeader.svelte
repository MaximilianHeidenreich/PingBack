<script lang="ts">
	import { storeFeedStyle } from "$lib/stores/storeFeedStyle";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
    import { IconRefresh, IconSearch, IconStack2 } from "@tabler/icons-svelte";
	import { get } from "svelte/store";
	import IconButton from "./buttons/IconButton.svelte";

    // HANDLERS
    function onToggleFeedStyle() {
        if (get(storeFeedStyle) === "card") storeFeedStyle.set("compact-list");
        else if (get(storeFeedStyle) === "compact-list") storeFeedStyle.set("card");
    }

</script>

<header>
    <ul class="justify-between">
        <li class="grow"><span class="text-xl font-medium">{$storePageHeaderTitle}</span></li>
        <li>
            <ul class="gap-4">
                <li><IconButton><IconSearch slot="icon" size={26} stroke={2}/></IconButton></li>
                <li><IconButton on:click={onToggleFeedStyle} ><IconStack2 slot="icon" size={26} stroke={2}/></IconButton></li>
                <li><IconButton><IconRefresh slot="icon" size={26} stroke={2}/></IconButton></li>
            </ul>
        </li>
    </ul>
</header>

<style lang="postcss">
    header {
        @apply w-full px-6 py-6 border-b-2 border-gray-100 ;
    }
    header ul {
        @apply flex items-center;
    }
</style>