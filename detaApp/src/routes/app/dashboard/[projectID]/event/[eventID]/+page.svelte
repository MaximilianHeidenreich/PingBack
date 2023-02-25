<script lang="ts">
    import type { PageData } from "./$types";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
	import { onMount } from "svelte";
	import AppContentSection from "$cmp/core/AppScaffold/AppContentSection.svelte";
	import TextParser from "$cmp/core/eventParsers/TextParser.svelte";
	import { IconArrowsVertical, IconLink, IconTrash } from "@tabler/icons-svelte";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import EventTagDisplay from "$cmp/EventTagDisplay.svelte";
    import { generatePalette } from "emoji-palette";
	import IconButton from "$cmp/core/buttons/IconButton.svelte";
	import { convertHexToRGBA } from "$lib/utils/colors";

    // PROPS
    export let  data: PageData;
    
    // STATE
    let event = data.event;
    let projectId = data.projectId;
    
    let reducedEmojiColor: string;
    let emojiPalette: any = generatePalette(event.icon);
    reducedEmojiColor = convertHexToRGBA(emojiPalette[0], 0.15);
    

    // HOOKS
    onMount(async () => {
        storePageHeaderTitle.set(`Event Details`);
    });

</script>

{#if !event}
<AppContentSection class="!px-6">
    <p class="text-center mx-auto max-w-[50ch]">
        Event not found!
    </p>
</AppContentSection>
{:else}
<AppContentSection class="!px-4">
    <header class="overview mb-2 w-full flex gap-8">
        <div class="icon">
            <div class="w-fit mt-1 p-4 aspect-square flex justify-center items-center bg-[#8686861e] rounded-3xl" style="background: {reducedEmojiColor};">
                <span class="icon text-4xl">{event.icon}</span>
            </div>
        </div>
        <div class="meta">
            <header>
                <span class="event-title">{event.title}</span>
                <span class="event-name">{event.event} @ {event.channel} · {new Date(event.createdAt).toLocaleString("de-DE", {day: "numeric", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})}</span>
            </header>
            <footer class="w-full flex justify-end">
                <ul class="flex items-center gap-1.5">
                    <li><IconButton><IconLink slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
                    <li><IconButton><IconTrash slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
                </ul>
            </footer>
        </div>
    </header>
    <hr class="mt-4">
</AppContentSection>
<AppContentSection class="!px-4">
    <details class="mb-6">
        <summary class="cursor-pointer flex justify-between items-center gap-2">
            <span class="text-2xl font-medium">Tags <span class="font-mono text-base">({Object.keys(event.tags).length})</span></span>
            <IconArrowsVertical size={ICON_TOKENS.SIZE.SM} stroke={ICON_TOKENS.STROKE.BASE}/>
        </summary>
        <div class="mt-2">
            <EventTagDisplay event={event}/>
        </div>
    </details>
    <hr class="mt-4">
</AppContentSection>
<AppContentSection class="!px-4">
    <header class="mb-6">
        <span class="text-2xl font-medium">Description</span>
    </header>
    {#if event.parser === "text"}
        <p>
            <TextParser {event}/>
        </p>
    {:else if event.parser === "markdown"}
        {@html data.compiledDescription}
    {/if}
</AppContentSection>
{/if}

<style lang="postcss">
    .overview header {
        @apply flex flex-col gap-1 mt-3 mb-6;
    }
    .overview .meta {
        @apply w-full grow;
    }
    header .event-title {
        @apply text-lg font-semibold truncate;
    }
    header .event-name {
        @apply text-sm font-mono text-gray-500;
    }
</style>
