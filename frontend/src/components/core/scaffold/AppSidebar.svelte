<script lang="ts">
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";

    import "$css/menuLinks.postcss";
    import { page } from "$app/stores";
    import { fade, fly } from "svelte/transition";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";
    import MenuLink from "./MenuLink.svelte";
    import IconButton from "../buttons/IconButton.svelte";
    import { isMobile } from "$lib/utils/width";
    import IconCog from "../icons/IconCog.svelte";
    import IconArchive from "../icons/IconArchive.svelte";
    import IconSignalGraph from "../icons/IconSignalGraph.svelte";
    import IconMailInbox from "../icons/IconMailInbox.svelte";
    import IconSignalFull from "../icons/IconSignalFull.svelte";
    import IconHelpQuestionSquare from "../icons/IconHelpQuestionSquare.svelte";
    import ThemeToggle from "../buttons/ThemeToggle.svelte";
    import { goto } from "$app/navigation";

    // HANDLERS
    function onHandleMenuLinkClick() {
        s_appSidebarCollapsed.set(isMobile());
    }

</script>

{#if !$s_appSidebarCollapsed}
    <aside
        transition:fly={{
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING,
            x: -100
        }}>
        <div class="nav-sidebar app-area">
            <section class="pt-4">
                <header>
                    <span class="text-xl font-bold"><span class="text-blub-500">Ping</span>Back</span>
                </header>
                <hr class="my-3 !mt-5 w-full">
                <ul class="m-links">
                    <li>
                        <MenuLink
                            href="/app/feed"
                            active={$page.url.pathname.startsWith("/app/feed")}
                            on:click={onHandleMenuLinkClick}>
                            <IconMailInbox size={TKN_ICON.SIZE.BASE} style="currentColor" />
                            <span>Feed</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/metrics"
                            active={$page.url.pathname.startsWith("/app/feed")}
                            on:click={onHandleMenuLinkClick}>
                            <IconSignalFull size={TKN_ICON.SIZE.BASE} style="currentColor" />
                            <span>Metrics</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/monitor"
                            active={$page.url.pathname.startsWith("/app/monitor")}
                            on:click={onHandleMenuLinkClick}>
                            <IconSignalGraph size={TKN_ICON.SIZE.BASE} style="currentColor" />
                            <span>Monitor</span>
                        </MenuLink>
                    </li>
                </ul>
                <hr class="my-3 !mt-5 w-full">
                <ul>
                    <li>
                        <MenuLink
                            href="/app/projects"
                            active={$page.url.pathname.startsWith("/app/projects")}
                            on:click={onHandleMenuLinkClick}>
                            <IconArchive sie={TKN_ICON.SIZE.BASE} style="currentColor" />
                            <span>Projects</span>
                        </MenuLink>
                    </li>
                </ul>
            </section>

            <section class="flex">
                <ul class="m-links">
                    <li>
                        <MenuLink
                            href="/app/settings"
                            active={$page.url.pathname.startsWith("/app/settings")}
                            on:click={onHandleMenuLinkClick}>
                            <IconCog size={TKN_ICON.SIZE.BASE} style="currentColor" />
                            <span>Settings</span>
                        </MenuLink>
                    </li>
                    <!--<li>
                        <MenuLink
                            href="/docs"
                            active={$page.url.pathname.startsWith("/docs")}>
                            <Book1 />
                            <span>Help</span>
                        </MenuLink>
                    </li>-->
                </ul>
                <hr class="my-3 w-full">
                <ul class="w-full flex justify-between gap-3">
                    <li>
                        <IconButton on:click={() => goto("/docs")}><!-- type="link" href="/docs" target="_blank"> -->
                            <IconHelpQuestionSquare size={TKN_ICON.SIZE.SM} />
                        </IconButton>
                        </li>
                    <li>
                        <ThemeToggle /> <!-- TODO: Re-Enable when good -->
                    </li>
                </ul>
            </section>
        </div>
    </aside>
    {#key $s_appSidebarCollapsed}
    <div aria-hidden="true" class="mobile-bg" on:click={() => s_appSidebarCollapsed.set(true)}
        transition:fade={{
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING,
        }}></div>
    {/key}
{/if}

<style lang="postcss">
    aside {
        @apply isolate z-50 fixed top-0 bottom-0 flex h-full max-h-full py-6;
        grid-row: 1 / 3;
        grid-column: 1;
    }

    @media screen and (min-width: 768px) {
        aside {
            @apply relative block py-0;
            grid-row: 1 / 3;
            grid-column: 1;
        }
    }

    .nav-sidebar {
        @apply z-10 bg-white;
        @apply p-4;
        @apply h-full flex flex-col justify-between items-center pb-3;
    }

    .mobile-bg {
        display: none;
    }
    @media screen and (max-width: 768px) {
        .mobile-bg {
            @apply block bg-black opacity-30;
            @apply fixed top-0 left-0 bottom-0 right-0;
            @apply z-40;
        }
    }

    section {
        @apply flex flex-col items-center;
    }
    section + section {
        @apply mt-8;
    }
    section header {
        @apply mb-2;
    }
    section header .title {
        @apply text-sm font-normal uppercase tracking-wide text-gray-400;
    }
</style>
