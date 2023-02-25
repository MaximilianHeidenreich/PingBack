<script lang="ts">
    import type { PageData } from "./$types";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
	import { onMount } from "svelte";
	import { storeActiveProjectID } from "$lib/stores/storeActiveProject";
	import { storeEvents, store_fetchEvents } from "$lib/stores/storeEvents";
	import { get } from "svelte/store";
	import PageContent from "$cmp/core/PageContent.svelte";
	import PageContentSection from "$cmp/core/PageContentSection.svelte";
	import EventFeed from "$cmp/core/eventFeed/EventFeed.svelte";
	import AppContentSection from "$cmp/core/AppScaffold/AppContentSection.svelte";

    // PROPS
    export let  data: PageData;
    
    // STATE
    let projectId = data.projectId;
    //$: events = Object.keys($storeEvents[projectId]).flatMap((key) => $storeEvents[projectId][key]);
    $: $storeEvents && console.log(get(storeEvents));
    $: eventsRaw = ($storeEvents && $storeEvents[projectId]) && Object.keys($storeEvents[projectId]).flatMap((key) => $storeEvents[projectId][key]);
    $: events = eventsRaw || [];

    // HOOKS
    onMount(async () => {
        storePageHeaderTitle.set(`Feed`);

        store_fetchEvents(projectId, {});
    });
</script>

<AppContentSection class="h-full grow overflow-y-scroll">
    <EventFeed events={data.events}>

    </EventFeed>
</AppContentSection>
<!--<PageContent>
    <PageContentSection>
        <EventFeed {events}/>
    </PageContentSection>
</PageContent>-->
