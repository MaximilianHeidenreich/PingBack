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
    import { IconCopy, IconHash, IconKey, IconPlus, IconTrash } from "@tabler/icons-svelte";
    import AddCircle from "iconsax-svelte/AddCircle.svelte";
    import type { PageServerData } from "./$types";

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
            <fieldset class="flex items-center gap-8">
                <Button clazz="w-full shrink-0 grow flex-1 flex justify-center items-center gap-8"
                    on:click={onNewProject}>
                    <IconPlus size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.BASE}/>
                    <span>New Project</span>
                </Button>
                <Input placeholder="Search projects" bind:value={filterValue}/>
            </fieldset>
        </form>
        <hr class="mt-4 mb-8">

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
                            <AddCircle size={TKN_ICON.SIZE.SM}/>
                        </IconButton>
                    </div>
                    <ul>
                    {#if project.channels.length <= 0}
                        <li class="py-3"><span class="text-gray-500">No channels yet.</span></li>
                    {:else}
                        {#each project.channels as channel}
                            <li class="flex items-center justify-between border-b-2 border-neutral-100 py-1">
                                <ul class="flex items-center">
                                    <li>
                                        <IconHash
                                            size={18}
                                            stroke={2} />
                                    </li>
                                    <li><span class="font-mono">{channel.id}</span></li>
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
                                            ><IconCopy
                                                size={TKN_ICON.SIZE.BASE}
                                                stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                                    </li>
                                    <li>
                                        <IconButton on:click={() => onDeleteChannel(project, channel.id)}
                                            ><IconTrash
                                                size={TKN_ICON.SIZE.BASE}
                                                stroke={TKN_ICON.STROKE.BASE} /></IconButton>
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
                            <AddCircle size={TKN_ICON.SIZE.SM}/>
                        </IconButton>
                    </div>
                    <ul>
                    {#if data.apiKeys.filter(e => e.project === project.key).length <= 0}
                        <li class="py-3"><span class="text-gray-500">No keys yet.</span></li>
                    {:else}
                        {#each data.apiKeys as apiKey}
                            <li class="flex items-center justify-between border-b-2 border-neutral-100 py-3">
                                <div class="flex flex-col gap-1">
                                    <span class="font-mono text-sm">{apiKey.displayName}</span>
                                    <ul class="flex items-center gap-2">
                                        <li class="mt-0.5">
                                            <IconKey
                                                size={18}
                                                stroke={2} />
                                        </li>
                                        <li><span class="font-mono">{apiKey.key}</span></li>
                                    </ul>
                                </div>
                                <ul class="flex">
                                    <li>
                                        <IconButton
                                            on:click={() => {
                                                copyToClipboard(apiKey.key);
                                            }}
                                            ><IconCopy
                                                size={TKN_ICON.SIZE.BASE}
                                                stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                                    </li>
                                    <li>
                                        <IconButton
                                            on:click={() => {
                                                onDeleteApiKey(apiKey.key, apiKey.displayName);
                                            }}
                                            ><IconTrash
                                                size={TKN_ICON.SIZE.BASE}
                                                stroke={TKN_ICON.STROKE.BASE} /></IconButton>
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