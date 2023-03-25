<script lang="ts">
    import { s_eventListStyle } from "./s_eventListStyle";
    import type { IEvent } from "$lib/types/IEvent";

    // PROPS
    export let event: IEvent;
</script>

<li class="item {$s_eventListStyle}">
    {#if $s_eventListStyle === "compact"}
    <a href="/app/event/{event.key}">
        <ul>
            <li class="icon"><span>{event.icon}</span></li>
            <li class="title"><span>{event.title}</span></li>
            <li class="meta"><span>
                <!-- TODO: Add setting for https://day.js.org/docs/en/plugin/relative-time short time -->
                {event.project} · {new Date(
                            event.createdAt
                        ).toLocaleString("de-DE", {
                            day: "numeric",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
            </span></li>
        </ul>
    </a>
    {:else}
    todo
    {/if}
</li>

<style lang="postcss">
    .item {
        @apply flex-1;
    }

    .item.compact {
        @apply px-6 py-3.5;
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
</style>