<script lang="ts">
    import { relativeTime } from "svelte-relative-time";
    import { s_eventListStyle } from "./s_eventListStyle";
    import type { IEvent } from "$lib/types/IEvent";
    import { s_timeFormat } from "$lib/stores/s_timeFormat";

    // PROPS
    export let event: IEvent,
        odd: boolean = true;
</script>

<li class="item {$s_eventListStyle}" class:odd>
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
        <div class="icon-wrapper">
            <span class="icon">{event.icon}</span>
        </div>
        <div class="meta">
            <span class="title">{event.title}</span>
            <div class="description-preview">
                <p>
                    {event.description}<br>
                    asd
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
    .item.odd {
        @apply bg-neutral-50;
    }

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
        @apply w-full mb-5 max-w-lg self-center;
    }
    .item.card a {
        @apply w-full flex items-start p-5 gap-5 min-w-[40ch];
        @apply bg-white border drop-shadow-xl rounded-3xl;
    }
    .item.card .icon-wrapper {
       @apply aspect-square w-min shrink-0 flex justify-center items-center px-4;
       @apply bg-red-100 rounded-2xl;
    }
    .item.card .icon-wrapper .icon {
        @apply text-3xl;
    }
    .item.card .meta {
        @apply flex flex-col justify-between;
    }
    .item.card .meta .title {
        @apply text-xl font-medium text-gray-800;
    }
    .item.card .meta .description-preview {
        @apply mt-1 mb-5;
    }
    .item.card .meta .details {
        @apply flex gap-2;
        @apply text-sm text-gray-500;
    }
</style>