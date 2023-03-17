<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import type { IEvent } from "$lib/types/IEvent";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconDots } from "@tabler/icons-svelte";
    import { s_eventListStyle } from "./s_eventListStyle";

    // PROPS
    export let event: IEvent,
        odd: boolean = false;
</script>

<li class="{odd && $s_eventListStyle === "compact" ? 'odd' : ''}">
    {#if $s_eventListStyle === "compact"}
    <a href="/app/project/{event.project}/event/{event.key}" class="compact">
        <div class="title">
            <span class="icon">{event.icon}</span>
            <span class="title">{event.title}</span>
        </div>
        <div class="meta">
            <span>
                {new Date(event.createdAt).toLocaleString("de-DE", {
                        day: "numeric",
                        month: "numeric",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
            </span>
            <!--<IconButton>
                <IconDotsVertical size={TKN_ICON.SIZE.BASE} stroke={TKN_ICON.STROKE.BASE} />
            </IconButton>-->
        </div>
    </a>
    {:else if $s_eventListStyle === "card"}
    <a href="/app/project/{event.project}/event/{event.key}" class="card">
        <div class="icon-wrapper">
            <div class="icon-bg">
                <span class="icon">{event.icon}</span>
            </div>
        </div>
        <div class="content">
            <header>
                <span class="title">{event.title}</span>
            </header>
            {#if event.description}
            <div class="description">
                {event.description}
            </div>
            {/if}
            <footer>
                <span>
                    {event.eventName} @ {event.channel} · {new Date(
                        event.createdAt
                    ).toLocaleString("de-DE", {
                        day: "numeric",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </span>
                <IconButton>
                    <IconDots
                        size={TKN_ICON.SIZE.BASE}
                        stroke={TKN_ICON.STROKE.BASE}/>
                </IconButton>
            </footer>
        </div>
    </a>
    {/if}
</li>

<style lang="postcss">
    li {
        @apply flex-1 py-2 px-7;
    }
    li.odd {
        @apply bg-neutral-100;
    }
    li a.compact {
        @apply flex justify-between items-center gap-6;
    }
    li a.compact .title {
        @apply flex items-center gap-4 shrink truncate;
    }
    li a.compact .title .icon {
        @apply text-2xl;
    }
    li a.compact .title .title {
        @apply font-medium truncate shrink;
    }
    li a.compact .meta {
        @apply shrink-0 w-fit flex items-center gap-4;
    }

    li a.card {
       @apply flex-1 w-full flex gap-4 mt-6;
       @apply bg-neutral-50 rounded-2xl p-4;
    }
    li a.card .icon-wrapper {

    }
    li a.card .content {
        @apply flex-1;
    }
    li a.card .content .title {
        @apply shrink-0 text-lg font-medium truncate;
    }
    li a.card footer {
        @apply flex justify-end items-center gap-2;
    }
</style>