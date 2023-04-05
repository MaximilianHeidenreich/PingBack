<script lang="ts">
    import { generatePalette } from "emoji-palette";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import AppContentSectionHeader from "$cmp/core/scaffold/AppContentSectionHeader.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconArrowsVertical, IconTrash } from "@tabler/icons-svelte";
    import type { PageData } from "./$types";
    import { browser } from "$app/environment";
    import { clientDeleteEvent } from "$lib/helpers/api/eventClient";
    import toast from "svelte-french-toast";
    import toastOptions from "$lib/utils/toast";
    import { s_timeFormat } from "$lib/stores/s_timeFormat";
    import { relativeTime } from "svelte-relative-time";

    // PROPS
    export let data: PageData;

    // STATE
    const event = data.event;

    let loadingDeleteEvent = false;

    s_headerTitle.set(`Event – ${event?.key.split("-")[0]}`);

    // FN
    function getIconColor(): string {
        if (!browser) return "#ffffff";
        const iconPalette = generatePalette(event?.icon || "⚙️");
        return iconPalette[0];
    }

    // HANDLERS
    async function onDeleteEvent() {
        if (!event) return;
        loadingDeleteEvent = true;
        try {
            await clientDeleteEvent(fetch, event.key);
        }
        catch (e) {
            console.error(e);
            toast.error("Could not delete event!", toastOptions());
            loadingDeleteEvent = false;
            return;
        }
        //goto("/app/feed");
        history.back();
        loadingDeleteEvent = false;
        toast.success("Event deleted!", toastOptions());
    }
</script>

<AppContent>
{#if !event}
    <AppContentSection>
        <p class="mx-auto max-w-[50ch] text-center">Event not found!</p>
    </AppContentSection>
{:else}
    <AppContentSection>
        <header class="overview mb-2 flex w-full gap-8">
            <div class="icon">
                <div
                    class="mt-1 p-5 flex aspect-square items-center justify-center rounded-3xl bg-transparent transition-all duration-300"
                    style="background: {getIconColor()}55;">
                    <span class="icon text-4xl">{event.icon}</span>
                </div>
            </div>
            <div class="meta">
                <header>
                    <span class="event-title">{event.title}</span>
                    <span class="event-name"
                        >{event.name} · #{event.channel} ·
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
                        </span>
                </header>
                <footer class="flex w-full justify-end">
                    <ul class="flex items-center gap-1.5">
                        <!--<li>
                            <IconButton
                                ><IconLink
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>-->
                        <li>
                            <IconButton
                                on:click={onDeleteEvent}
                                loading={loadingDeleteEvent}
                                ><IconTrash
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                    </ul>
                </footer>
            </div>
        </header>
        <!--<hr class="mt-4" />-->
    </AppContentSection>
    <AppContentSection clazz="!mt-4">
        <AppContentSectionHeader>
            <svelte:fragment slot="title">Description</svelte:fragment>
        </AppContentSectionHeader>
        {#if event.parser === "text" || event.parser === "log"}
            <p>{event.description}</p>
        {:else if event.parser === "markdown"}
            <strong>Markdown description support coming soon!</strong><br>
            {@html event.description}
        {:else if event.parser === "json"}
            <strong>JSON description support coming soon!</strong><br>
            {@html event.description}
        {/if}
    </AppContentSection>
    {#if Object.keys(event.tags).length > 0}
    <AppContentSection>
        <AppContentSectionHeader>
            <svelte:fragment slot="title">Tags</svelte:fragment>
        </AppContentSectionHeader>
        <details class="mb-6">
            <summary class="flex cursor-pointer items-center justify-between gap-2">
                <span>
                    Tags <span class="font-mono text-base">({Object.keys(event.tags).length})</span>
                </span>
                <IconArrowsVertical
                    size={TKN_ICON.SIZE.SM}
                    stroke={TKN_ICON.STROKE.BASE} />
            </summary>
            <div class="mt-2">
                <pre>{JSON.stringify(event.tags, null, 2)}</pre> <!-- TODO: impl pretty json view -->
            </div>
        </details>
        <hr class="mt-4" />
    </AppContentSection>
    {/if}
{/if}
</AppContent>

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
