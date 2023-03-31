<script lang="ts">
    import { goto } from "$app/navigation";
    import Spinner from "$cmp/core/utils/Spinner.svelte";
    import { onMount } from "svelte";

    // HOOKS
    onMount(() => {
        goto("/app", { replaceState: true });
    });
</script>

<div class="flex h-full w-full items-center justify-center">
    <Spinner />
</div>
