<script lang="ts">
    import { invalidate } from "$app/navigation";
    import Button from "$cmp/core/buttons/Button.svelte";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import { pushModal } from "$cmp/core/modals/modalStore";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import ModalCreateApiKey from "$cmp/modalContents/ModalCreateApiKey.svelte";
    import ModalCreateChannel from "$cmp/modalContents/ModalCreateChannel.svelte";
    import ModalCreateProject from "$cmp/modalContents/ModalCreateProject.svelte";
    import ModalDeleteApiKey from "$cmp/modalContents/ModalDeleteApiKey.svelte";
    import ModalDeleteChannel from "$cmp/modalContents/ModalDeleteChannel.svelte";
    import ModalDeleteProject from "$cmp/modalContents/ModalDeleteProject.svelte";
    import type { IProject } from "$lib/types/IProject";
    import { copyToClipboard } from "$lib/utils/clipboard";
    import { TKN_ICON } from "$lib/utils/tokens";
    import type { PageServerData } from "./$types";
    import IconAddSquare from "$cmp/core/icons/IconAddSquare.svelte";
    import IconClipboard from "$cmp/core/icons/IconClipboard.svelte";
    import IconDeleteBin2 from "$cmp/core/icons/IconDeleteBin2.svelte";
    import IconSignHash from "$cmp/core/icons/IconSignHash.svelte";
    import IconLoginKey from "$cmp/core/icons/IconLoginKey.svelte";

    s_headerTitle.set("Projects");

    // PROPS
    export let data: PageServerData;

    // STATE
    let filterValue = "";
    $: data.projects?.sort((a, b) => a.displayName.localeCompare(b.displayName));
    $: filteredProjects = data.projects.filter(e => e.displayName.toLowerCase().includes(filterValue.toLowerCase()));

    // HANDLERS
    function onNewProject() {
        pushModal(ModalCreateProject, { onCreated: () => invalidate("/app/settings") });
    }
    async function onNewChannel(project: IProject) {
        pushModal(ModalCreateChannel, { project, onCreated: () => invalidate("/app/settings") });
    }
    function onNewApiKey(projectKey: string) {
        pushModal(ModalCreateApiKey, { projectKey, onCreated: () => invalidate("/app/settings") });
    }

    function onDeleteProject(project: IProject) {
        pushModal(ModalDeleteProject, { project, onDeleted: () => invalidate("/app/settings") })
    }
    function onDeleteChannel(project: IProject, channelID: string) {
        pushModal(ModalDeleteChannel, { project, channelID, onDeleted: () => invalidate("/app/settings") })
    }
    function onDeleteApiKey(apiKey: string, keyName: string) {
        pushModal(ModalDeleteApiKey, { apiKey, keyName, onDeleted: () => invalidate("/app/settings") })
    }

</script>

<AppContent style="section">
    {#if !data.projects || !data.apiKeys}
    err no project / api keys <!-- TODO: impl -->
    {:else}
    <AppContentSection>
        <form on:submit|preventDefault>
            <fieldset class="flex items-stretch gap-6">
                <Button clazz="w-full shrink-0 grow flex-1 flex justify-center items-center gap-4"
                    on:click={onNewProject}>
                    <!--<IconPlus size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.BASE}/>-->
                    <span>New Project</span>
                </Button>
                <Input placeholder="Search projects" bind:value={filterValue}/>
            </fieldset>
        </form>
        <hr class="mt-6 mb-6">

        {#if !filteredProjects}
        no projects with filter
        {:else}
        {#each filteredProjects as project}
        <details class="project-item"> <!-- TODO: Fix icon -->
            <summary class="text-xl font-medium"><span class="icon"></span>{project.displayName}</summary>
            <div class="content flex flex-col items-stretch gap-6">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="uppercase text-sm font-medium text-neutral-500">Channels</span>
                        <IconButton on:click={() => onNewChannel(project)}>
                            <IconAddSquare size={TKN_ICON.SIZE.SM}/>
                        </IconButton>
                    </div>
                    <ul>
                    {#if project.channels.length <= 0}
                        <li class="py-3"><span class="text-gray-500">No channels yet.</span></li>
                    {:else}
                        {#each project.channels as channel}
                            <li class="flex items-center justify-between border-b-2 border-neutral-100 py-1 shrink">
                                <ul class="flex-1 flex items-center gap-2 shrink grow overflow-hidden">
                                    <li class="shrink-0">
                                        <IconSignHash
                                            size={TKN_ICON.SIZE.XS} />
                                    </li>
                                    <li class="truncate"><span class="font-mono">{channel.id}</span></li>
                                </ul>
                                <ul class="flex">
                                    <!--<li>
                                        {#if channel.notify}
                                            <IconButton
                                                ><IconBell
                                                    size={TKN_ICON.SIZE.BASE}
                                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                                        {:else}
                                            <IconButton
                                                ><IconBellOff
                                                    size={TKN_ICON.SIZE.BASE}
                                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                                        {/if}
                                    </li>-->
                                    <li>
                                        <IconButton
                                            on:click={() => {
                                                copyToClipboard(channel.id);
                                            }}
                                            ><IconClipboard
                                                size={TKN_ICON.SIZE.SM} /></IconButton>
                                    </li>
                                    <li>
                                        <IconButton on:click={() => onDeleteChannel(project, channel.id)}
                                            ><IconDeleteBin2
                                                size={TKN_ICON.SIZE.SM} /></IconButton>
                                    </li>
                                </ul>
                            </li>
                        {/each}
                    {/if}
                    </ul>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="uppercase text-sm font-medium text-neutral-500">API Keys</span>
                        <IconButton on:click={() => onNewApiKey(project.key)}>
                            <IconAddSquare size={TKN_ICON.SIZE.SM}/>
                        </IconButton>
                    </div>
                    <ul>
                    {#if data.apiKeys.filter(e => e.project === project.key).length <= 0}
                        <li class="py-3"><span class="text-gray-500">No keys yet.</span></li>
                    {:else}
                        {#each data.apiKeys.filter(e => e.project === project.key) as apiKey}
                            <li class="flex items-center justify-between border-b-2 border-neutral-100 py-3 shrink">
                                <div class="flex flex-col gap-1 shrink grow overflow-hidden">
                                    <span class="font-mono text-sm">{apiKey.displayName}</span>
                                    <ul class="flex-1 flex items-center gap-2">
                                        <li class="shrink-0">
                                            <IconLoginKey
                                                size={TKN_ICON.SIZE.XS} />
                                        </li>
                                        <li class="truncate"><span class="font-mono">{apiKey.key}</span></li> <!-- TODO: Hide by default -->
                                    </ul>
                                </div>
                                <ul class="flex">
                                    <li>
                                        <IconButton
                                            on:click={() => {
                                                copyToClipboard(apiKey.key);
                                            }}
                                            ><IconClipboard
                                                size={TKN_ICON.SIZE.SM}/></IconButton>
                                    </li>
                                    <li>
                                        <IconButton
                                            on:click={() => {
                                                onDeleteApiKey(apiKey.key, apiKey.displayName);
                                            }}
                                            ><IconDeleteBin2
                                                size={TKN_ICON.SIZE.SM}/></IconButton>
                                    </li>
                                </ul>
                            </li>
                        {/each}
                    {/if}
                    </ul>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="uppercase text-sm font-medium text-neutral-500">Other</span>
                    </div>
                    <div class="mt-4">
                        <Button style="red" on:click={() => onDeleteProject(project)}>Delete Project</Button>
                    </div>
                </div>
            </div>
        </details>
        {/each}
        {/if}
    </AppContentSection>
    {/if}
</AppContent>

<style lang="postcss">
    .project-item {
        @apply border-2 border-neutral-200 bg-neutral-50/30 p-2 px-6 rounded-xl;
    }
    .project-item > summary {
        @apply cursor-pointer py-2;
    }
    .project-item > .content {
        @apply mt-2 mb-4;
    }
    details[open].project-item > summary {
        @apply border-b-2 border-neutral-200 pb-4;
    }
    .project-item + .project-item {
        @apply mt-6;
    }


    details > summary {
        list-style-type: '▶️';
    }

    details[open] > summary {
        list-style-type: '▼';
    }
    details > summary > span {
        @apply ml-2;
    }
</style>
