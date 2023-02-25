<script lang="ts">
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import { storeFeedStyle } from "$lib/stores/storeFeedStyle";
    import type { IEvent } from "$lib/types/IEvent";
	import { convertHexToRGBA } from "$lib/utils/colors";
	import { IconDots } from "@tabler/icons-svelte";
    import { generatePalette } from "emoji-palette";
	import { onMount } from "svelte";
	import IconButton from "../buttons/IconButton.svelte";
	import TextParser from "../eventParsers/TextParser.svelte";

    // PROPS
    export let  event: IEvent;
    $: baseURL = "/app/dashboard/" + $storeActiveProject?.id;

    let emojiPalette: string[] = [];
    $: reducedEmojiColor = "#000";
    
    // HOOKS
    onMount(() => {
        emojiPalette = generatePalette(event.icon);
        reducedEmojiColor = convertHexToRGBA(emojiPalette[0], 0.15);
    });

</script>

<li class="item {$storeFeedStyle}">
    {#if $storeFeedStyle === "compact-list"}
    <a href="{baseURL}/event/{event.id}">
        <div class="title">
            <!--<div class="w-14 h-12 aspect-square bg-lime-200 p-2 pl-0 flex justify-start items-center">
                <span class="icon">{event.icon}</span>
            </div>-->
            <span class="icon text-2xl">{event.icon}</span>
            <span class="text-base font-medium truncate">{event.title}</span>
        </div>
        <div class="meta">
            <span class="text-sm text-gray-500 font-mono">{new Date(event.createdAt).toLocaleString("de-DE", {day: "numeric", month: "numeric", year: "2-digit", hour: "2-digit", minute: "2-digit"})}</span>
        </div>
    </a>

    <!-- TODO: Fix cards on mobile -->
    {:else if $storeFeedStyle === "card"}
    <a href="{baseURL}/event/{event.id}">
        <div class="icon">
            <div class="w-fit mt-1 p-4 aspect-square flex justify-center items-center bg-[#8686861e] rounded-2xl" style="background: {reducedEmojiColor};">
                <span class="icon">{event.icon}</span>
            </div>
        </div>
        <div class="meta">
            <header>
                <span>{event.title}</span>
            </header>
            {#if event.description}
            <div class="preview">
                {#if event.parser === "text"}
                    <p class="line-clamp-4">
                        <TextParser {event} />
                    </p>
                {:else if event.parser === "markdown"}
                    <p class="text-gray-500 italic">
                        Markdown content, no preview available!
                    </p>
                {/if}
            </div>
            {/if}
            <footer>
                <ul class="flex justify-between items-center gap-8">
                    <li class="text-sm text-gray-500 font-mono">{event.event} @ {event.channel} · {new Date(event.createdAt).toLocaleString("de-DE", {day: "numeric", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})}</li>
                    <li class="hidden md:block">
                        <IconButton><IconDots slot="icon" size={24} stroke={2}/></IconButton>
                    </li>
                </ul>
            </footer>
        </div>
    </a>
    {/if}
</li>

<style lang="postcss">
    /* SHARED */
    li.item {
        @apply w-full py-0.5 border-b-2 border-neutral-100;
        /*@apply bg-gray-100;*/
    }
    li.item > a {
        @apply px-4;
    }

    /* COMPACT-LIST */
    li.item.compact-list a {
        @apply flex items-center gap-2 py-2;
    }
    .item.compact-list a > .title {
        @apply w-[10ch] grow shrink flex items-center gap-2;
    }
    .item.compact-list a > .meta {
        @apply w-fit shrink-0 flex justify-end;
    }

    /* CARD */
    .item.card {
        @apply mb-4 pb-3;
    }
    .item.card a {
        @apply w-full flex gap-4;
    }
    .item.card .meta {
        @apply w-fit shrink-0 grow;
    }
    .item.card header span {
        @apply text-lg font-semibold truncate;
    }
    .item.card .preview {
        @apply mt-2 mb-1 max-w-[40ch];
    }

</style>