<script lang="ts">
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import InfiniteEventList from "$cmp/eventList/InfiniteEventList.svelte";
    import type { IProject } from "$lib/types/IProject";
    import { getContext } from "svelte";

    s_headerTitle.set("Feed");

    // STATE
    const project = getContext<IProject>("project");
</script>

<InfiniteEventList
    {project}
    startTimestamp={project.latestEventTimestamp}
    query={{}} />
