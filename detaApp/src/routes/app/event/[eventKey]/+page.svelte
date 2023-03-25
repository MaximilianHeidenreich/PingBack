<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconArrowsVertical, IconLink, IconTrash } from "@tabler/icons-svelte";
    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // STATE
    const event = data.event;

    s_headerTitle.set(`Event – ${event?.key.split("-")[0]}`);
</script>

{#if !event}
    <AppContentSection>
        <p class="mx-auto max-w-[50ch] text-center">Event not found!</p>
    </AppContentSection>
{:else}
    <AppContentSection>
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
    {#if Object.keys(event.tags).length > 0}
    <AppContentSection>
        <details class="mb-6">
            <summary class="flex cursor-pointer items-center justify-between gap-2">
                <span class="text-2xl font-medium"
                    >Tags <span class="font-mono text-base">({Object.keys(event.tags).length})</span
                    ></span>
                <IconArrowsVertical
                    size={TKN_ICON.SIZE.SM}
                    stroke={TKN_ICON.STROKE.BASE} />
            </summary>
            <div class="mt-2">
                <pre>{JSON.stringify(event.tags, null, 2)}</pre>
            </div>
        </details>
        <hr class="mt-4" />
    </AppContentSection>
    {/if}
    <AppContentSection>
        <header class="mb-6">
            <span class="text-2xl font-medium">Description</span>
        </header>
        {#if event.parser === "text"}
            <p>
                {event.description}
            </p>
        {:else if event.parser === "markdown"}
            <strong>Markdown support coming soon!</strong><br>
            {@html event.description}
        {/if}
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
