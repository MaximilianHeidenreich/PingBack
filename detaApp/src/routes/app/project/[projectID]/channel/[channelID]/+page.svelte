<script lang="ts">
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import InfiniteEventList from "$cmp/eventList/InfiniteEventList.svelte";
    import type { IProject } from "$lib/types/IProject";
    import { getContext } from "svelte";
    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // STATE
    const project = getContext<IProject>("project");
    const channel = project.channels.find((e) => e.id === data.channelID);

    s_headerTitle.set(`Channel – ${channel?.id}`);
</script>

{#key data.channelID}
    <InfiniteEventList
        {project}
        startTimestamp={channel?.latestEventTimestamp || Date.now()}
        query={{ channel: data.channelID }} />
{/key}
