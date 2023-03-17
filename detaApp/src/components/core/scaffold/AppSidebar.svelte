<script lang="ts">
    import ProjectSidebar from "./ProjectSidebar.svelte";
    import { IconChartBar, IconHome, IconPlus, IconQuestionMark, IconTool } from "@tabler/icons-svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import IconButton from "../buttons/IconButton.svelte";

    import "$css/menuLinks.postcss";

    // HANDLERS
    function onCreateProject() {

    }

    function onOpenProject() {

    }

</script>

<aside>
    <div class="nav-sidebar flex flex-col">
        <header class="mb-12">
            <span class="text-xl font-semibold"><span class="text-pink-500">Ping</span>Back</span>
        </header>
        <div class="flex-1 flex flex-col justify-between">
            <div>
                <section>
                    <ul class="m-links">
                        <li><a href="/"><IconHome size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Overview</a></li>
                    </ul>
                </section>
                <section>
                    <header class="flex justify-between items-center gap-6">
                        <span class="title">Projects</span>
                        <IconButton><IconPlus size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/></IconButton>
                    </header>
                    <ul class="m-links">
                        <li><a href="/">Stats</a></li>
                        <li><a href="/">Settings</a></li>
                        <li><a href="/">Help</a></li>
                    </ul>
                </section>
            </div>
            <ul class="m-links">
                <li><a href="/"><IconChartBar size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Stats</a></li>
                <li><a href="/"><IconTool size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Settings</a></li>
                <li><a href="/"><IconQuestionMark size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Help</a></li>
            </ul>
        </div>
    </div>
    <ProjectSidebar/>
</aside>

<style lang="postcss">
    aside {
        @apply isolate flex h-full max-h-full;
        grid-row: 1;
        grid-column: 1;
    }
    .nav-sidebar {
        @apply  bg-white;
        @apply px-6 py-6 border-r-2;
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