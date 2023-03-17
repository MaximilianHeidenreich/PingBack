<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
import type { IEvent } from "$lib/types/IEvent";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconDotsVertical } from "@tabler/icons-svelte";


    // PROPS
    export let event: IEvent,
        odd: boolean = false;
</script>

<li class:odd>
    <a href="/" class="compact">
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
            <IconButton>
                <IconDotsVertical size={TKN_ICON.SIZE.BASE} stroke={TKN_ICON.STROKE.BASE} />
            </IconButton>
        </div>
    </a>
    <!-- TODO: Card -->
</li>

<style lang="postcss">
    li {
        @apply flex-1 py-1 px-4;
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
</style>