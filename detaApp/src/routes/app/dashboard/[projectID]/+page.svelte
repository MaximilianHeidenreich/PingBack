<script lang="ts">
    import { goto } from "$app/navigation";
    import Spinner from "$cmp/utils/Spinner.svelte";
    import { ICON_TOKENS } from "$lib/utils/tokens";
    import { IconFidgetSpinner } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    import type { PageData } from "./$types";

    // PROPS
    export let data: PageData;

    // STATE
    let projectId = data.projectId;

    onMount(() => goto(`/app/dashboard/${projectId}/feed`));
</script>

<div class="flex h-full w-full items-center justify-center">
    <Spinner />
</div>
