<script lang="ts">
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import { IconBell, IconChartHistogram, IconHash, IconPlus, IconRss, IconSettings } from "@tabler/icons-svelte";
    import IconButton from "../buttons/IconButton.svelte";
    import { fly } from "svelte/transition";

    import "$css/menuLinks.postcss";
    import { s_projectSidebarActiveProject } from "./s_projectSidebarActiveProject";
    import { page } from "$app/stores";

    // STATE
    $: BASE_URL = `/app/project/${$s_projectSidebarActiveProject?.key}`;

</script>

{#if $s_projectSidebarActiveProject !== undefined}
<div class="project-nav"
    transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        x: -100
    }}>
    <header class="mb-12">
        <div class="flex items-center justify-between gap-4 shrink-0">
            <span class="text-lg font-medium truncate">{$s_projectSidebarActiveProject?.displayName}</span>
            <IconButton
                type="link"
                href="{BASE_URL}/settings">
                <IconSettings
                    size={TKN_ICON.SIZE.BASE}
                    stroke={TKN_ICON.STROKE.BASE} />
            </IconButton>
        </div>
    </header>
    <section>
        <ul class="m-links">
            <li>
                <a
                    href="{BASE_URL}/feed"
                    class:active={$page.url.pathname.endsWith(`feed`)}
                    ><IconRss
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Feed</a>
            </li>
            <li>
                <a
                    href="{BASE_URL}/metrics"
                    class:active={$page.url.pathname.endsWith(`metrics`)}
                    ><IconChartHistogram
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Metrics</a>
            </li>
            <li>
                <a
                    href="{BASE_URL}/monitor"
                    class:active={$page.url.pathname.endsWith(`monitor`)}
                    ><IconBell
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Monitor</a>
            </li>
        </ul>
        <hr class="mt-5" />
    </section>
    <section>
        <header class="flex items-center justify-between gap-6">
            <span class="title">Channels</span>
            <IconButton
                type="button"
                on:click={() => {}}>
                <IconPlus
                    size={TKN_ICON.SIZE.BASE}
                    stroke={TKN_ICON.STROKE.BASE} />
            </IconButton>
        </header>
        <ul class="m-links mt-1">
            {#each $s_projectSidebarActiveProject.channels as channel}
                <li>
                    <a
                        href="{BASE_URL}/channel/{channel.id}"
                        class="font-mono"
                        class:active={$page.url.pathname.endsWith(`channel/${channel.id}`)}>
                        <IconHash
                            class="-mr-2 shrink-0"
                            size={TKN_ICON.SIZE.SM}
                            stroke={TKN_ICON.STROKE.BASE} />
                        <span class="max-w-[15ch] truncate">{channel.id}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </section>
</div>
{/if}

<style lang="postcss">
    .project-nav {
        @apply px-6 py-6 border-r-4;
        @apply bg-white;
        @apply min-w-[20ch] max-w-[24ch];
    }

    section {
        @apply mb-4;
    }
    section header span.title {
        @apply text-lg font-medium;
    }
</style>