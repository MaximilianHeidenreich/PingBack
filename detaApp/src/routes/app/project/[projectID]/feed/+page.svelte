<script lang="ts">
    import InfiniteEventList from "$cmp/core/eventList/InfiniteEventList.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import type { IProject } from "$lib/types/IProject";
    import { getContext } from "svelte";

    s_headerTitle.set("Feed");

</script>

<InfiniteEventList
    query={{}} />
