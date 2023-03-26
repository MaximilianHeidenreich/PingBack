<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
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

</script>

<AppContent style="clear">
todo: add
<br>
todo: no projects

{#if !projects}
err
{:else}
<AppContentSection>

    <form on:submit|preventDefault>
        <fieldset class="flex items-center">
            <Button clazz="!flex-1 !shrink-0 flex items-center gap-2">
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
    <div class="bg-red-300" style="height: 200vh"></div>
{/if}
</AppContent>