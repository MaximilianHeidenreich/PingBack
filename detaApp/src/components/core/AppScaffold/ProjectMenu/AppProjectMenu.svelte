<script lang="ts">
	import IconButton from "$cmp/core/buttons/IconButton.svelte";
	import CreateChannelDialog from "$cmp/dialoges/CreateChannelDialog.svelte";
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
    import { storeAppProjectMenuOpen } from "$lib/stores/storeAppProjectMenuOpen";
	import type { IProject } from "$lib/types/IProject";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { TRANSITION_TOKENS } from "$lib/utils/transitions";
	import { openDialog } from "$lib/utils/utils";
	import { Icon123, IconChartHistogram, IconHash, IconPlus, IconRss, IconSettings } from "@tabler/icons-svelte";
	import { onDestroy } from "svelte";
	import { fly } from "svelte/transition";

    // PROPS
    export let  project: IProject;

    // STATE
    $: baseURL = `/app/dashboard/${project.id}`;

    const unsubscribeStoreActiveProject = storeActiveProject.subscribe(value => {
		if (value) storeAppProjectMenuOpen.set(true);
        else storeAppProjectMenuOpen.set(false);
	});

    // HOOKS
	onDestroy(unsubscribeStoreActiveProject);

</script>

<div class="projectMenu"
    class:open="{$storeAppProjectMenuOpen}"
    transition:fly="{{ duration: TRANSITION_TOKENS.DURATION, easing: TRANSITION_TOKENS.EASING, x: -100  }}">
    <header>
        <div class="flex justify-between items-center gap-6">
            <span>{project.name}</span>
            <IconButton type="link" href="{baseURL}/settings">
                <IconSettings slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/>
            </IconButton>
        </div>
        <hr class="mt-6">
    </header>
    <section>
        <ul class="menu-links">
            <li><a href="{baseURL}/feed"><IconRss size={ICON_TOKENS.SIZE.SM} stroke={ICON_TOKENS.STROKE.BASE}/> Feed</a></li>
            <li><a href="{baseURL}/charts"><IconChartHistogram size={ICON_TOKENS.SIZE.SM} stroke={ICON_TOKENS.STROKE.BASE}/> Charts</a></li>
            <li><a href="{baseURL}/metrics"><Icon123 size={ICON_TOKENS.SIZE.SM} stroke={ICON_TOKENS.STROKE.BASE}/> Metrics</a></li>
        </ul>
        <hr class="mt-5">
    </section>
    <section>
        <header class="flex justify-between items-center gap-6">
            <span>Channels</span>
            <IconButton type="button" 
                on:click={() => openDialog(CreateChannelDialog)}>
                <IconPlus slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE}/>
            </IconButton>
        </header>
        <ul class="menu-links mt-1">
            {#each project.channels as channel}
                <li><a href="{baseURL}/channel/{channel.name}" class="font-mono"><IconHash class="-mr-2" size={ICON_TOKENS.SIZE.SM} stroke={ICON_TOKENS.STROKE.BASE}/>{channel.name}</a></li>
            {/each}
        </ul>
    </section>
</div>

<style lang="postcss">
    .projectMenu {
        @apply h-full max-h-full w-max z-0 px-6 py-6 border-r-2 border-neutral-100 bg-white;
    }

    header span {
        @apply text-xl font-medium;
    }
    section {
        @apply my-3;
    }

    /* MENU LINKS */
    .menu-links {
        @apply w-full flex flex-col gap-1;
    }
    .menu-links > li {
        @apply w-full;
    }
    .menu-links > li > a {
        @apply w-full py-2 px-4 flex items-center gap-3 rounded-xl;
        @apply transition-colors ease-in-out duration-200;
    }
    .menu-links > li > a:hover {
        @apply bg-neutral-100;
    }
    .menu-links > li > a:active {
        @apply bg-neutral-200;
    }

    @media screen and (max-width: 768px) {
        .projectMenu {
            @apply py-[1.2rem];
        }
        header span {
            @apply text-base;
        }
    }
</style>