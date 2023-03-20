<script lang="ts">
    import { IconChartBar, IconHome, IconPlus, IconQuestionMark, IconTool } from "@tabler/icons-svelte";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import IconButton from "../buttons/IconButton.svelte";
    import ProjectSidebar from "./ProjectSidebar.svelte";

    import "$css/menuLinks.postcss";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { pushModal } from "../modals/modalStore";
    import ModalCreateProject from "$cmp/modalContents/ModalCreateProject.svelte";
    import { s_projectSidebarActiveProject } from "./s_projectSidebarActiveProject";
    import { s_appSidebarFetchAllProjects, s_appSidebarProjects, s_appSidebarProjectsLoading } from "./s_appSidebarProjects";
    import Spinner from "../utils/Spinner.svelte";
    import type { IProject } from "$lib/types/IProject";
    import { invalidate, invalidateAll } from "$app/navigation";
    import { fly } from "svelte/transition";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";

    // STATE
    // foo

    // HANDLERS
    function onCreateProject() {
        pushModal(ModalCreateProject);
        //pushModal(ModalDeleteProject, { projectName: "teest", projectID: "sad" });
    }

    onMount(async () => {
        await s_appSidebarFetchAllProjects();
    })

</script>

{#if !$s_appSidebarCollapsed}
<aside
    transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        x: -100
    }}>
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
                        <IconButton on:click={onCreateProject}>
                            <IconPlus size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/>
                        </IconButton>
                    </header>
                    <ul class="m-links shrink-0">
                        {#if $s_appSidebarProjectsLoading}
                        <div class="flex justify-center items-center py-2">
                            <Spinner />
                        </div>
                        {:else}
                        {#if $s_appSidebarProjects.length === 0}
                            <li class="text-gray-500"><span class="text-sm">No projects yet.</span></li>
                        {/if}
                        {#each $s_appSidebarProjects as project}
                        <li><a
                            href="/app/project/{project.key}/feed"
                            class="truncate"
                            class:active={$page.url.pathname.startsWith(`/app/project/${project.key}`)}> <!-- TODO: handle issue same name starting with -->
                            {project.displayName}</a></li>
                        {/each}
                        {/if}
                    </ul>
                </section>
            </div>
            <ul class="m-links">
                <li><a href="/app/stats"><IconChartBar size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Stats</a></li>
                <li><a href="/app/settings"><IconTool size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Settings</a></li>
                <li><a href="https://maximilianheidenreich.gitbook.io/pingback/" target="_blank"><IconQuestionMark size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/> Help</a></li>
            </ul>
        </div>
    </div>
    {#if $s_projectSidebarActiveProject}
    <ProjectSidebar/>
    {/if}
</aside>
{/if}

<style lang="postcss">
    aside {
        @apply isolate flex h-full max-h-full;
        grid-row: 1;
        grid-column: 1;
    }
    .nav-sidebar {
        @apply  bg-white z-10;
        @apply px-6 py-6 border-r-2;
        @apply max-w-[20ch];
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