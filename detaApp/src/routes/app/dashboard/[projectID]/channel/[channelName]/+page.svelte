<script lang="ts">
    import AppContentSection from "$cmp/core/AppScaffold/AppContentSection.svelte";
    import AutoLoadEventFeed from "$cmp/core/eventFeed/AutoLoadEventFeed.svelte";
    import { store_fetchEvents } from "$lib/stores/storeEvents";
    import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
    import { onMount } from "svelte";

    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // STATE
    let projectId = data.projectId;

    // HOOKS
    onMount(async () => {
        storePageHeaderTitle.set(`#${data.channelName}`);

        store_fetchEvents(projectId, {});
    });
</script>

<AppContentSection class="h-full w-full grow overflow-y-scroll !py-0">
    <AutoLoadEventFeed query={{ project: projectId, channel: data.channelName }} />
</AppContentSection>
