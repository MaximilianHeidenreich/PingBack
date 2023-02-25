<script lang="ts">
	import { storeSidebarOpen } from "$lib/stores/storeSidebarOpen";
	import { onMount } from "svelte";
	import { Toaster } from "svelte-french-toast";
	import DialogPortal from "../DialogPortal.svelte";
	import AppHeader from "./AppHeader.svelte";
	import AppScaffold from "./AppScaffold.svelte";
	import AppSidebar from "./AppSidebar.svelte";

    // HOOKS
    onMount(() => {
        // Auto expands sidebar on desktop but keeps it closed on mobile
        if (window.screen.width <= 768) storeSidebarOpen.set(false);
        else storeSidebarOpen.set(true);
    })
</script>

<Toaster />
<DialogPortal />

<AppScaffold>
    <svelte:fragment slot="sidebar">
        <AppSidebar />
    </svelte:fragment>
    <svelte:fragment slot="pageHeader">
        <AppHeader />
    </svelte:fragment>
    <svelte:fragment slot="pageContent">
        <slot />
    </svelte:fragment>
</AppScaffold>