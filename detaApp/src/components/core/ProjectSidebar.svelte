<script lang="ts">
	import CreateChannelDialog from "$cmp/dialoges/CreateChannelDialog.svelte";
	import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
	import { storeActiveProjectID } from "$lib/stores/storeActiveProject";
	import { storeProjects } from "$lib/stores/storeProjects";
    import { IconSettings, IconPlus, IconRss, IconInfoSquareRounded, IconChartBar, Icon123, IconChartHistogram, IconHash } from "@tabler/icons-svelte";
	import { get } from "svelte/store";
	import IconButton from "./buttons/IconButton.svelte";

    // PROPS
    export let  activeProjectID: string | undefined;

    // STATE
    $: activeProject = $storeProjects.filter(p => p.id === $storeActiveProjectID)[0];
    $: expanded = $storeActiveProjectID !== undefined;
    $: baseURL = `/app/dashboard/${$storeActiveProjectID}`;


    $: $storeActiveProjectID && console.log("S activeProjectID ", $storeActiveProjectID);
    $: $storeActiveProjectID && console.log("activeProject ", activeProject);
</script>

<aside
    class:expanded>
    {#if activeProject}
        <header>
            <span>{activeProject.name}</span>
            <IconButton type="link" href="{baseURL}/settings">
                <IconSettings slot="icon" size={26} stroke={2}/>
            </IconButton>
        </header>
        <section>
            <ul>
                <li><a href="{baseURL}/feed" class="listLink"><IconRss size={20} stroke={2}/> Feed</a></li>
                <li><a href="{baseURL}/charts" class="listLink"><IconChartHistogram size={20} stroke={2}/> Charts</a></li>
                <li><a href="{baseURL}/metrics" class="listLink"><Icon123 size={20} stroke={2}/> Metrics</a></li>
            </ul>
        </section>
        <section>
            <header>
                <span>Channels</span>
                <IconButton on:click={() => { storeActiveDialog.set(CreateChannelDialog); }}>
                    <IconPlus slot="icon" size={26} stroke={2}/>
                </IconButton>
            </header>
            <ul>
                {#each activeProject.channels as channel}
                    <li><a href="{baseURL}/channel/{channel.name}" class="listLink"><IconHash size={20} stroke={2.5}/> {channel.name}</a></li>
                {/each}
            </ul>
        </section>
    {/if}
</aside>

<style lang="postcss">
    aside {
        @apply w-full h-full min-w-[25ch] max-w-[25ch] border-r-2 border-gray-100;
    }
    aside.expanded {
        @apply min-w-[25ch];
    }
    aside:not(.expanded) {
        @apply w-0 border-0;
    }
    aside > header {
        @apply px-6 py-6 mb-0;
        @apply flex justify-between items-center;
    }
    aside section {
       @apply mb-6 px-6 w-full min-w-full; 
    }
    aside section > header {
        @apply flex justify-between items-center;
    }
    header > span {
        @apply font-medium text-lg;
    }
    aside section > ul {
        @apply w-full min-w-full flex flex-col items-stretch justify-center gap-1;
    }
    aside section > ul li {
        @apply w-full min-w-full;
    }
    aside section > ul li a {
        @apply w-full min-w-full p-3 rounded-xl text-black;
        @apply transition-colors ease-in-out duration-200;
    }
    aside section > ul li a:hover {
        @apply bg-neutral-100;
    }
    aside section > ul li a:active {
        @apply bg-neutral-200;
    }

    a.listLink {
        @apply flex items-center gap-3;
    }
</style>