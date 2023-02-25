<script lang="ts">
    import AppContentSection from "$cmp/core/AppScaffold/AppContentSection.svelte";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import CreateApiKeyDialog from "$cmp/dialoges/CreateApiKeyDialog.svelte";
    import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
    import { storeActiveProject } from "$lib/stores/storeActiveProject";
    import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
    import { ICON_TOKENS } from "$lib/utils/tokens";
    import {
        IconBell,
        IconBellOff,
        IconCopy,
        IconHash,
        IconKey,
        IconPlus,
        IconTrash
    } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // HANDLERS
    function onCreateApiKey() {
        storeActiveDialog.set(CreateApiKeyDialog);
    }

    // HOOKS
    onMount(async () => {
        storePageHeaderTitle.set(`Settings`);
    });
</script>

<div class="h-full grow overflow-y-auto">
    {#if !$storeActiveProject}
        <AppContentSection class="!px-6">
            <p class="mx-auto max-w-[50ch] text-center">
                No active project.<br />
                <span class="text-sm">Please choose a project!</span>
            </p>
        </AppContentSection>
    {:else}
        <AppContentSection class="!px-6">
            <header class="mb-2">
                <span class="text-2xl font-medium">Project</span>
            </header>
            <fieldset class="flex items-center justify-between">
                <span class="font-mono">{$storeActiveProject.id}</span>
                <IconButton
                    ><IconCopy
                        slot="icon"
                        size={24}
                        stroke={2} /></IconButton>
            </fieldset>
            <hr class="mt-4" />
        </AppContentSection>
        <AppContentSection class="!px-6">
            <header class="mb-2">
                <span class="text-2xl font-medium">Channels</span>
            </header>
            <ul class="flex flex-col gap-2">
                {#each $storeActiveProject.channels as channel}
                    <li
                        class="flex items-center justify-between border-b-2 border-neutral-100 py-1">
                        <ul class="flex items-center">
                            <li>
                                <IconHash
                                    size={18}
                                    stroke={2} />
                            </li>
                            <li><span class="font-mono">{channel.name}</span></li>
                        </ul>
                        <ul class="flex">
                            <li>
                                {#if channel.notify}
                                    <IconButton
                                        ><IconBell
                                            slot="icon"
                                            size={ICON_TOKENS.SIZE.BASE}
                                            stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                                {:else}
                                    <IconButton
                                        ><IconBellOff
                                            slot="icon"
                                            size={ICON_TOKENS.SIZE.BASE}
                                            stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                                {/if}
                            </li>
                            <li>
                                <IconButton
                                    ><IconCopy
                                        slot="icon"
                                        size={ICON_TOKENS.SIZE.BASE}
                                        stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                            </li>
                            <li>
                                <IconButton
                                    ><IconTrash
                                        slot="icon"
                                        size={ICON_TOKENS.SIZE.BASE}
                                        stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                            </li>
                        </ul>
                    </li>
                {/each}
            </ul>
        </AppContentSection>
        <AppContentSection class="!px-6">
            <header class="mb-2 flex items-center gap-3">
                <span class="mb-0.5 text-2xl font-medium">API Keys</span>
                <IconButton on:click={onCreateApiKey}>
                    <IconPlus
                        slot="icon"
                        size={ICON_TOKENS.SIZE.BASE}
                        stroke={ICON_TOKENS.STROKE.BASE} />
                </IconButton>
            </header>
            <ul class="flex flex-col gap-2">
                {#each data.apiKeys as apiKey}
                    <li
                        class="flex items-center justify-between border-b-2 border-neutral-100 py-3">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-sm">{apiKey.name}</span>
                            <ul class="flex items-center gap-2">
                                <li class="mt-0.5">
                                    <IconKey
                                        size={18}
                                        stroke={2} />
                                </li>
                                <li><span class="font-mono">{apiKey.apiKey}</span></li>
                            </ul>
                        </div>
                        <ul class="flex">
                            <li>
                                <IconButton
                                    ><IconCopy
                                        slot="icon"
                                        size={ICON_TOKENS.SIZE.BASE}
                                        stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                            </li>
                            <li>
                                <IconButton
                                    ><IconTrash
                                        slot="icon"
                                        size={ICON_TOKENS.SIZE.BASE}
                                        stroke={ICON_TOKENS.STROKE.BASE} /></IconButton>
                            </li>
                        </ul>
                    </li>
                {/each}
            </ul>
        </AppContentSection>
        <AppContentSection class="!px-6">
            <header class="mb-2">
                <span class="text-2xl font-medium">Danger Zone</span>
            </header>
            todo: delete project / data <!-- TODO: Delete project / data -->
        </AppContentSection>
    {/if}
</div>
