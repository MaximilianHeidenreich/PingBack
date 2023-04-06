<script lang="ts">
    import { relativeTime } from "svelte-relative-time";
    import { s_eventListStyle } from "./s_eventListStyle";
    import type { IEvent } from "$lib/types/IEvent";
    import { s_timeFormat } from "$lib/stores/s_timeFormat";
    import { browser } from "$app/environment";
    import { generatePalette } from "emoji-palette";
    import { isMobile } from "$lib/utils/width";

    // PROPS
    export let event: IEvent,
        odd: boolean = true;

    // STATE
    $: truncatedDescription = event.parser === "text" ? `${(event.description as string).substring(0, isMobile() ? 83 : 200)}...` : "No preview available.";
    

    // FN
    function getIconColor(): string {
        if (!browser) return "#aaaaaa";
        const iconPalette = generatePalette(event?.icon || "⚙️");
        return iconPalette[0];
    }
</script>

<li class="item {$s_eventListStyle} {event.parser === "log" ? `log-${event.tags["_level"]}` : ''}" class:odd>
    {#if $s_eventListStyle === "compact"}
    <a href="/app/event/{event.key}">
        <ul>
            <li class="icon"><span>{event.icon}</span></li>
            <li class="title"><span>{event.title}</span></li>
            <li class="meta">
                {#if $s_timeFormat === "relative"}
                <span class="text-xs" use:relativeTime={{ date: event.createdAt }}></span>
                {:else if $s_timeFormat === "absolute"}
                <span class="text-xs">
                    {new Date(
                            event.createdAt
                        ).toLocaleString("de-DE", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                </span>
                {/if}
            </li>
        </ul>
    </a>
    {:else}
    <a href="/app/event/{event.key}">
        <div class="icon-wrapper" style="background: {getIconColor()}55;">
            <span class="icon">{event.icon}</span>
        </div>
        <div class="meta">
            <span class="title">{event.title}</span>
            <div class="description-preview">
                <p class="">
                    {truncatedDescription}
                </p>
            </div>
            <ul class="details">
                <li><span class="font-mono">{event.project}</span></li>
                <li><span class="font-bold">·</span></li>
                <li><span class="font-mono">#{event.channel}</span></li>
                <li><span class="font-bold">·</span></li>
                <li>
                    {#if $s_timeFormat === "relative"}
                    <span use:relativeTime={{ date: event.createdAt }}></span>
                    {:else if $s_timeFormat === "absolute"}
                    <span>
                        {new Date(
                                event.createdAt
                            ).toLocaleString("de-DE", {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                    </span>
                    {/if}
                </li>
            </ul>
        </div>
    </a>
    {/if}
</li>

<style lang="postcss">
    .item {
        @apply flex-1;
    }
    .item.compact.odd {
        @apply bg-neutral-50;
    }

    .item.log-debug .title { @apply text-violet-700; }
    .item.log-info .title { @apply text-blue-700; }
    .item.log-warning .title { @apply text-orange-500; }
    .item.log-error .title { @apply text-red-600; }

    .item.compact {
        @apply px-6 py-3.5 px-6 py-3 border-b;
    }
    .item.compact a {
        @apply flex-1;
    }
    .item.compact a > ul {
        @apply flex flex-wrap items-center gap-4;
    }
    .item.compact li.icon {
        @apply shrink grow-0;
        @apply text-xl;
    }
    .item.compact li.title {
        @apply flex-1 shrink-0 truncate;
        @apply font-medium;
    }
    .item.compact li.meta {
        @aplly shrink-0;
        @apply text-sm font-medium text-neutral-500;
    }

    .item.card {
        @apply w-full mb-5 px-2 max-w-lg self-center;
    }
    .item.card a {
        @apply w-full flex items-start p-5 gap-5;
        @apply bg-white border drop-shadow-xl rounded-3xl;
    }
    .item.card .icon-wrapper {
       @apply aspect-square w-min shrink-0 flex justify-center items-center px-4;
       @apply rounded-2xl;
    }
    .item.card .icon-wrapper .icon {
        @apply text-3xl;
    }
    .item.card .meta {
        @apply flex flex-col justify-between;
    }
    .item.card .meta .title {
        @apply text-xl font-medium;
    }
    .item.card .meta .description-preview {
        @apply mt-1 mb-5;
    }
    .item.card .meta .details {
        @apply flex gap-2 flex-wrap; /* TODO: better layout? */
        @apply text-sm text-gray-500;
    }
    @media screen and (min-width: 769px) {
        .item.card a {
            @apply min-w-[40ch];
        }
    }
</style>
