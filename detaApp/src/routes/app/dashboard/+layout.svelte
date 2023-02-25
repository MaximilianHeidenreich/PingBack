<script>
	import App from "$cmp/core/AppScaffold/App.svelte";


	/*import { invalidate, invalidateAll } from "$app/navigation";
	import DialogPortal from "$cmp/core/DialogPortal.svelte";
    import MainMenu from "$cmp/core/MainMenu.svelte";
	import PageHeader from "$cmp/core/PageHeader.svelte";
	import ProjectSidebar from "$cmp/core/ProjectSidebar.svelte";
	import { storeActiveProjectID } from "$lib/stores/storeActiveProject";
	import { store_fetchAllProjects } from "$lib/stores/storeProjects";
	import { onMount } from "svelte";

    // HOOKS
    onMount(() => {
        console.log("Start loading data from api...");

        store_fetchAllProjects();
    });

    // DEPENDS
    $: $storeActiveProjectID && invalidateAll();///("app:projectID");
*/
</script>

<App>
    <slot/>
</App>
<!--<DialogPortal />
<div id="appWrapper">

    <MainMenu />
    <ProjectSidebar 
        activeProjectID={$storeActiveProjectID}/>
    <main>
        <slot/>
    </main>

</div>

<style lang="postcss">
    #appWrapper {
        @apply w-full h-full;
        @apply grid grid-rows-1;
        grid-template-columns: auto auto 1fr;/*10ch 25ch auto;*/
    }
    main {
        @apply w-full min-w-full h-full overflow-hidden;
    }
</style>-->