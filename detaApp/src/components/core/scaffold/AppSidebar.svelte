<script lang="ts">
    import {
    IconArchive,
    IconBell,
        IconChartHistogram,
        IconQuestionMark,
        IconRss,
        IconSettings,
    } from "@tabler/icons-svelte";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";

    import "$css/menuLinks.postcss";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";
    import MenuLink from "./MenuLink.svelte";

    // STATE
    // foo

</script>

{#if !$s_appSidebarCollapsed}
    <aside
        transition:fly={{
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING,
            x: -100
        }}>
        <div class="nav-sidebar flex flex-col">
            <section>
                <span class="text-xl font-semibold"><span class="text-pink-500">Ping</span>Back</span>
            </section>
            <section>
                <ul class="m-links">
                    <li>
                        <MenuLink
                            href="/app/feed"
                            active={$page.url.pathname.startsWith("/app/feed")}>
                            <IconRss
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Feed</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/metrics"
                            active={$page.url.pathname.startsWith("/app/metrics")}>
                            <IconChartHistogram
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Metrics</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/monitor"
                            active={$page.url.pathname.startsWith("/app/monitor")}>
                            <IconBell
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Monitor</span>
                        </MenuLink>
                    </li>
                    <li>
                        <hr class="my-3">
                    </li>
                    <li>
                        <MenuLink
                            href="/app/projects"
                            active={$page.url.pathname.startsWith("/app/projects")}>
                            <IconArchive
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Projects</span>
                        </MenuLink>
                    </li>
                </ul>
            </section>
            <div class="flex-1"></div>
            <section class="!mb-0">
                <ul>
                    <li>
                        <MenuLink
                            href="/app/settings"
                            active={false}>
                            <IconSettings
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Settings</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            href="/docs"
                            active={false}>
                            <IconQuestionMark
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.BASE} />
                            <span>Help</span>
                        </MenuLink>
                    </li>
                </ul>
            </section>

            <!--<header class="mb-12">
                <span class="text-xl font-semibold"
                    ><span class="text-pink-500">Ping</span>Back</span>
            </header>
            <div class="flex flex-1 flex-col justify-between">
                <div>
                    <section>
                        <ul class="m-links">
                            <li>
                                <a href="/"
                                    ><IconHome
                                        size={TKN_ICON.SIZE.SM}
                                        stroke={TKN_ICON.STROKE.SM} /> Overview</a>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <header class="flex items-center justify-between gap-6">
                            <span class="title">Projects</span>
                            <IconButton on:click={onCreateProject}>
                                <IconPlus
                                    size={TKN_ICON.SIZE.SM}
                                    stroke={TKN_ICON.STROKE.SM} />
                            </IconButton>
                        </header>
                        <ul class="m-links shrink-0">
                            {#if $s_appSidebarProjectsLoading}
                                <div class="flex items-center justify-center py-2">
                                    <Spinner />
                                </div>
                            {:else}
                                {#if $s_appSidebarProjects.length === 0}
                                    <li class="text-gray-500">
                                        <span class="text-sm">No projects yet.</span>
                                    </li>
                                {/if}
                                {#each $s_appSidebarProjects as project}
                                    <li>
                                        <a
                                            href="/app/project/{project.key}/feed"
                                            class="truncate"
                                            class:active={$page.url.pathname.startsWith(
                                                `/app/project/${project.key}`
                                            )}>
                                            <!-- TODO: handle issue same name starting with
                                            {project.displayName}</a>
                                    </li>
                                {/each}
                            {/if}
                        </ul>
                    </section>
                </div>
                <ul class="m-links">
                    <!--<li><a href="/app/stats"><IconChartBar size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Stats</a></li>
                <li><a href="/app/settings"><IconTool size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Settings</a></li>
                    <li>
                        <a href="/app/playground"
                            ><IconBolt
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.SM} /> Playground</a>
                    </li>
                    <li>
                        <a
                            href="/docs"
                            ><IconQuestionMark
                                size={TKN_ICON.SIZE.SM}
                                stroke={TKN_ICON.STROKE.SM} /> Help</a>
                    </li>
                </ul>
            </div>-->
        </div>
    </aside>
{/if}

<style lang="postcss">
    aside {
        @apply isolate flex h-full max-h-full;
        grid-row: 1;
        grid-column: 1;
    }
    .nav-sidebar {
        @apply z-10 bg-white;
        @apply border-r-2 px-6 py-6;
        @apply w-fit;
    }

    section {
        @apply mb-8;
    }
    section header {
        @apply mb-2;
    }
    section header .title {
        @apply text-sm font-normal uppercase tracking-wide text-gray-400;
    }
</style>
