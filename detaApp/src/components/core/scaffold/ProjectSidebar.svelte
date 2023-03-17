<script lang="ts">
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconBell, IconChartHistogram, IconRss, IconSettings } from "@tabler/icons-svelte";
    import IconButton from "../buttons/IconButton.svelte";

    import "$css/menuLinks.postcss";

</script>

<div class="project-nav">
    <header class="mb-12">
        <div class="flex items-center justify-between gap-6">
            <span>Test Project</span>
            <IconButton
                type="button"
                href="/settings">
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
                    href="/feed"
                    class:active={false}
                    ><IconRss
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Feed</a>
            </li>
            <li>
                <a
                    href="/metrics"
                    class:active={false}
                    ><IconChartHistogram
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Metrics</a>
            </li>
            <li>
                <a
                    href="/monitor"
                    class:active={false}
                    ><IconBell
                        size={TKN_ICON.SIZE.SM}
                        stroke={TKN_ICON.STROKE.BASE} /> Monitor</a>
            </li>
        </ul>
        <hr class="mt-5" />
    </section>
</div>

<style lang="postcss">
    .project-nav {
        @apply bg-white bg-neutral-50;
        @apply px-6 py-6 border-r-4;
    }
</style>