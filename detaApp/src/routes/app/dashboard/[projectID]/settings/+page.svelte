<script lang="ts">
	import AppContentSection from "$cmp/core/AppScaffold/AppContentSection.svelte";
	import IconButton from "$cmp/core/buttons/IconButton.svelte";
	import PageContent from "$cmp/core/PageContent.svelte";
	import PageContentSection from "$cmp/core/PageContentSection.svelte";
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { IconBell, IconBellOff, IconCopy, IconHash, IconTrash } from "@tabler/icons-svelte";
	import { onMount } from "svelte";

    // HOOKS
    onMount(async () => {
        storePageHeaderTitle.set(`Settings`);
    });
</script>

{#if !$storeActiveProject}
<AppContentSection>
    <p class="text-center mx-auto max-w-[50ch]">
        No active project.<br>
        <span class="text-sm">Please choose a project!</span>
    </p>
</AppContentSection>
{:else}
<AppContentSection>
    <header class="mb-2">
        <span class="text-2xl font-medium">Project</span>
    </header>
    <fieldset class="flex justify-between items-center">
        <span class="font-mono">{$storeActiveProject.id}</span>
        <IconButton><IconCopy slot="icon" size={24} stroke={2}/></IconButton>
    </fieldset>
    <hr class="mt-4">
</AppContentSection>
<AppContentSection>
    <header class="mb-2">
        <span class="text-2xl font-medium">Channels</span>
    </header>
    <ul class="flex flex-col gap-2">
        {#each $storeActiveProject.channels as channel}
        <li class="flex justify-between items-center py-2 border-b-2 border-neutral-100">
            <ul class="flex items-center">
                <li><IconHash size={18} stroke={2}/></li>
                <li><span class="font-mono">{channel.name}</span></li>
            </ul>
            <ul class="flex">
                <li>
                    {#if channel.notify}
                    <IconButton><IconBell slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton>
                    {:else}
                    <IconButton><IconBellOff slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton>
                    {/if}
                </li>
                <li><IconButton><IconCopy slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
                <li><IconButton><IconTrash slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/></IconButton></li>
            </ul>
        </li>
        {/each}
    </ul>
</AppContentSection>
<AppContentSection>
    <header class="mb-2">
        <span class="text-2xl font-medium">Danger Zone</span>
    </header>
    todo: delete project / data <!-- TODO: Delete project / data -->
</AppContentSection>
{/if}
