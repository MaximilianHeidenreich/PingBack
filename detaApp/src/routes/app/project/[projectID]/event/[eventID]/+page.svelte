<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import InfiniteEventList from "$cmp/eventList/InfiniteEventList.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconLink, IconTrash } from "@tabler/icons-svelte";
    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // STATE
    const event = data.event;

    s_headerTitle.set(`Event – ${event?.key.split("-")[0]}`);
</script>

{#if !event}
    <AppContentSection class="!px-6">
        <p class="mx-auto max-w-[50ch] text-center">Event not found!</p>
    </AppContentSection>
{:else}
    <AppContentSection class="!px-6">
        <header class="overview mb-2 flex w-full gap-8">
            <div class="icon">
                <div
                    class="mt-1 flex aspect-square items-center justify-center rounded-3xl bg-[#8686861e] p-5"
                    style="background: gey;">
                    <span class="icon text-4xl">{event.icon}</span>
                </div>
            </div>
            <div class="meta">
                <header>
                    <span class="event-title">{event.title}</span>
                    <span class="event-name"
                        >{event.eventName} · #{event.channel} · {new Date(
                            event.createdAt
                        ).toLocaleString("de-DE", {
                            day: "numeric",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</span>
                </header>
                <footer class="flex w-full justify-end">
                    <ul class="flex items-center gap-1.5">
                        <li>
                            <IconButton
                                ><IconLink
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                        <li>
                            <IconButton
                                ><IconTrash
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                    </ul>
                </footer>
            </div>
        </header>
        <hr class="mt-4" />
    </AppContentSection>
{/if}

<style lang="postcss">
    .overview header {
        @apply mt-3 mb-6 flex flex-col gap-1;
    }
    .overview .meta {
        @apply w-full grow;
    }
    header .event-title {
        @apply truncate text-lg font-semibold;
    }
    header .event-name {
        @apply font-mono text-sm text-gray-500;
    }
</style>
