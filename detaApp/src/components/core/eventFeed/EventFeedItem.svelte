<script lang="ts">
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import { storeFeedStyle } from "$lib/stores/storeFeedStyle";
    import type { IEvent } from "$lib/types/IEvent";
	import { convertHexToRGBA } from "$lib/utils/colors";
	import { IconDots } from "@tabler/icons-svelte";
    import { generatePalette } from "emoji-palette";
	import IconButton from "../buttons/IconButton.svelte";
	import TextParser from "../eventParsers/TextParser.svelte";

    // PROPS
    export let  event: IEvent;
    $: baseURL = "/app/dashboard/" + $storeActiveProject?.id;

    let emojiPalette = generatePalette(event.icon);
    let reducedEmojiColor = convertHexToRGBA(emojiPalette[0], 0.15);
    

</script>

<li class="item {$storeFeedStyle}">
    {#if $storeFeedStyle === "compact-list"}
    <a href="{baseURL}/event/{event.id}">
        <div class="title">
            <div class="w-fit p-2 pl-0 aspect-square flex justify-start items-center">
                <span class="icon">{event.icon}</span>
            </div>
            <span class="text-base font-medium truncate">{event.title}</span>
        </div>
        <ul class="meta">
            <li><span class="text-sm text-gray-500 font-mono">{new Date(event.createdAt).toLocaleString("de-DE", {day: "numeric", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})}</span></li>
        </ul>
    </a>
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
                    <li>
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
        @apply w-full py-0.5;
        @apply border-b-2 border-neutral-100;
    }

    /* COMPACT-LIST */
    /*.item.compact-list {
        @apply py-0.5;
        @apply border-b-2 border-neutral-100;
    }*/
    .item.item.compact-list a {
        @apply flex justify-between items-center gap-8;
    }
    .item.compact-list a > .title {
        @apply w-full flex items-center gap-1 grow;
    }
    .item.compact-list a > .meta {
        @apply w-full grow flex justify-end;
    }

    @media screen and (max-width: 768px) {
        .item.compact-list a {
            @apply flex-col justify-start !gap-0;
        }
        .item.compact-list a > .meta {
            @apply justify-end;
        }
    }

    /* CARD */
    .item.card {
        @apply mb-4 pb-3;
    }
    .item.card a {
        @apply w-full flex gap-4;
    }
    .item.card .meta {
        @apply w-full grow;
    }
    .item.card header span {
        @apply text-lg font-semibold truncate;
    }
    .item.card .preview {
        @apply mt-2 mb-1 max-w-[50ch];
    }

</style>