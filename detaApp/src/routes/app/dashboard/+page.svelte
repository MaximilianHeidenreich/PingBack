<script lang="ts">
	import { storeActiveProjectID } from "$lib/stores/storeActiveProject";
	import { storePageHeaderTitle } from "$lib/stores/storePageHeader";
	import { onMount } from "svelte";

    // HOOKS
    onMount(() => {
        storeActiveProjectID.set(undefined);
        storePageHeaderTitle.set("PingBack — Recent Events");
    });
</script>
