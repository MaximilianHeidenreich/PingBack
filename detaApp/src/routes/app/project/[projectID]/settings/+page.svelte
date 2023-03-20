<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$cmp/core/buttons/Button.svelte";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { pushModal } from "$cmp/core/modals/modalStore";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import ModalCreateApiKey from "$cmp/modalContents/ModalCreateApiKey.svelte";
    import ModalDeleteProject from "$cmp/modalContents/ModalDeleteProject.svelte";
    import type { IProject } from "$lib/types/IProject";
    import { copyToClipboard } from "$lib/utils/clipboard";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconBell, IconBellOff, IconCopy, IconHash, IconKey, IconPlus, IconTrash } from "@tabler/icons-svelte";
    import { getContext } from "svelte";
    import type { PageData } from "./$types";

    s_headerTitle.set("Project Settings");

    // PROPS
    export let data: PageData;
    let { apiKeys } = data;

    // STATE
    const project = getContext<IProject>("project");

    // HANDLERS
    function onCreateApiKey() {
        pushModal(ModalCreateApiKey);
    }
    function onDeleteProject() {
        pushModal(ModalDeleteProject, {
            projectID: project.key,
            projectName: project.displayName,
            onDeleted: () => goto("/app")
        });
    }

</script>

<AppContentSection>
        <header class="mb-2">
            <span class="text-2xl font-medium">General</span>
        </header>
        <fieldset class="flex items-center justify-between">
            <span class="font-mono">{project.displayName}</span>
            <IconButton
                on:click={() => { copyToClipboard(project.key) }}
                ><IconCopy
                    size={24}
                    stroke={2} /></IconButton>
        </fieldset>
        <hr class="mt-4" />
    </AppContentSection>
    <AppContentSection>
        <header class="mb-2">
            <span class="text-2xl font-medium">Channels</span>
        </header>
        <ul class="flex flex-col gap-2">
            {#each project.channels as channel}
                <li
                    class="flex items-center justify-between border-b-2 border-neutral-100 py-1">
                    <ul class="flex items-center">
                        <li>
                            <IconHash
                                size={18}
                                stroke={2} />
                        </li>
                        <li><span class="font-mono">{channel.id}</span></li>
                    </ul>
                    <ul class="flex">
                        <li>
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
                        </li>
                        <li>
                            <IconButton
                                on:click={() => { copyToClipboard(channel.id) }}
                                ><IconCopy
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                        <li>
                            <IconButton
                                ><IconTrash
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                    </ul>
                </li>
            {/each}
        </ul>
    </AppContentSection>
    <AppContentSection>
        <header class="mb-2 flex items-center gap-3">
            <span class="mb-0.5 text-2xl font-medium">API Keys</span>
            <IconButton on:click={onCreateApiKey}>
                <IconPlus
                    size={TKN_ICON.SIZE.BASE}
                    stroke={TKN_ICON.STROKE.BASE} />
            </IconButton>
        </header>
        <ul class="flex flex-col gap-2">
            {#each apiKeys as apiKey}
                <li
                    class="flex items-center justify-between border-b-2 border-neutral-100 py-3">
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
                                on:click={() => { copyToClipboard(apiKey.key) }}
                                ><IconCopy
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                        <li>
                            <IconButton
                                ><IconTrash
                                    size={TKN_ICON.SIZE.BASE}
                                    stroke={TKN_ICON.STROKE.BASE} /></IconButton>
                        </li>
                    </ul>
                </li>
            {/each}
        </ul>
    </AppContentSection>
    <AppContentSection>
        <header class="mb-2">
            <span class="text-2xl font-medium">Danger Zone</span>
        </header>
        <!-- TODO: Delete project / data -->
        <Button style="primary" color="red" on:click={onDeleteProject}>Delete Project</Button>
    </AppContentSection>

