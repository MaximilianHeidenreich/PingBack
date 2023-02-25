<script lang="ts">
	import MainMenuButton from "./MainMenuButton.svelte";
    import { IconHelp, IconHome, IconPlus, IconUser } from "@tabler/icons-svelte";
	import { storeProjects } from "$lib/stores/storeProjects";
	import type { IProject } from "$lib/types/IProject";
	import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
	import CreateProjectDialog from "$cmp/dialoges/CreateProjectDialog.svelte";

    // UTILS
    function generateProjectDisplayName(project: IProject): string {
        return project.name.slice(0, 2).toUpperCase();
    }

</script>

<div id="mainMenu">
    <ul class="!gap-8 max-h-[90%]">
        <li><MainMenuButton type="link" href="/app/dashboard"><IconHome size={32} stroke={2}/></MainMenuButton></li>
        <ul class="overflow-x-auto"> <!-- TODO: Snap -->
            {#each $storeProjects as project}
                <li>
                    <MainMenuButton 
                        type="link"
                        href={`/app/dashboard/${project.id}/feed`}>
                        <span class="font-mono">{generateProjectDisplayName(project)}</span>
                    </MainMenuButton>
                </li>
            {/each}
            <li>
                <MainMenuButton
                    on:click={() => { storeActiveDialog.set(CreateProjectDialog); }}>
                    <IconPlus size={32} stroke={2}/>
                </MainMenuButton>
            </li>
        </ul>
    </ul>
    <ul>
        <li><MainMenuButton type="link" href="/app/help"><IconHelp size={32} stroke={2}/></MainMenuButton></li>
        <li><MainMenuButton><IconUser size={32} stroke={2}/></MainMenuButton></li>
    </ul>
</div>

<style lang="postcss">
    #mainMenu {
        @apply w-full h-full min-w-[10ch] max-w-[10ch] px-2 py-4 border-r-2 border-gray-200;
        @apply flex flex-col justify-between gap-6 max-h-full;
    }
    #mainMenu ul {
        @apply flex flex-col gap-2 items-center;
    }
</style>