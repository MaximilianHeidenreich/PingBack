<script lang="ts">
    import { goto } from "$app/navigation";
    import Spinner from "$cmp/utils/Spinner.svelte";
    import { ICON_TOKENS } from "$lib/utils/tokens";
    import { IconFidgetSpinner } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    // HOOKS
    onMount(() => {
        goto("/app/dashboard", { replaceState: true });
    });
</script>

<div class="flex h-full w-full items-center justify-center">
    <Spinner />
</div>
