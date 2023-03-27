<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";

    //import Button from "$cmp/core/buttons/OldButton.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import { pushModal } from "$cmp/core/modals/modalStore";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import ModalCreateProject from "$cmp/modalContents/ModalCreateProject.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconPlus } from "@tabler/icons-svelte";
    import type { PageServerData } from "./$types";

    s_headerTitle.set("Projects");

    // PROPS
    export let data: PageServerData;
    let { projects, apiKeys } = data;
    projects?.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // STATE
    let filteresProjects = projects;

    // HANDLERS
    function onNewProject() {
        pushModal(ModalCreateProject);
    }

</script>

<AppContent style="section">
    <!--todo: add
    <br>
    todo: no projects-->

    {#if !projects}
    err
    {:else}
    <AppContentSection>

        <form on:submit|preventDefault>
            <fieldset class="flex items-center gap-8">
                <Button clazz="w-full shrink-0 grow flex-1 flex justify-center items-center gap-8"
                    on:click={onNewProject}>
                    <IconPlus size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.BASE}/>
                    <span>New Project</span>
                </Button>
                <Input placeholder="Search projects"/>
            </fieldset>
        </form>
        <hr class="mt-4 mb-8">

        {#if !filteresProjects}
        no projects with filter
        {:else}
        {#each filteresProjects as project}
        <details>
            <summary class="mb-2 text-xl font-medium">{project.displayName}</summary>
            something
        </details>
        {/each}
        {/if}
    </AppContentSection>
    {/if}
</AppContent>