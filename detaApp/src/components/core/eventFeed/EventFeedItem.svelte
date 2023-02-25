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
	export let event: IEvent;
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
				<span class="truncate text-base font-medium">{event.title}</span>
			</div>
			<div class="meta">
				<span class="font-mono text-sm text-gray-500"
					>{new Date(event.createdAt).toLocaleString("de-DE", {
						day: "numeric",
						month: "numeric",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit"
					})}</span
				>
			</div>
		</a>

		<!-- TODO: Fix cards on mobile -->
	{:else if $storeFeedStyle === "card"}
		<a href="{baseURL}/event/{event.id}">
			<div class="icon">
				<div
					class="mt-1 flex aspect-square w-fit items-center justify-center rounded-2xl bg-[#8686861e] p-4"
					style="background: {reducedEmojiColor};"
				>
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
							<p class="italic text-gray-500">Markdown content, no preview available!</p>
						{/if}
					</div>
				{/if}
				<footer>
					<ul class="flex items-center justify-between gap-8">
						<li class="font-mono text-sm text-gray-500">
							{event.event} @ {event.channel} · {new Date(event.createdAt).toLocaleString("de-DE", {
								day: "numeric",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							})}
						</li>
						<li class="hidden md:block">
							<IconButton
								><IconDots
									slot="icon"
									size={24}
									stroke={2}
								/></IconButton
							>
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
		@apply w-full border-b-2 border-neutral-100 py-0.5;
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
		@apply flex w-[10ch] shrink grow items-center gap-2;
	}
	.item.compact-list a > .meta {
		@apply flex w-fit shrink-0 justify-end;
	}

	/* CARD */
	.item.card {
		@apply mb-4 pb-3;
	}
	.item.card a {
		@apply flex w-full gap-4;
	}
	.item.card .meta {
		@apply w-fit shrink-0 grow;
	}
	.item.card header span {
		@apply truncate text-lg font-semibold;
	}
	.item.card .preview {
		@apply mt-2 mb-1 max-w-[40ch];
	}
</style>
