<script lang="ts">
    import "$css/app.postcss";
    import { fetchSysContentHash } from "$lib/stores/s_sysContentHash";
    import { sw_register } from "$lib/utils/serviceWorker";
    import { onMount } from "svelte";
    import { Toaster } from "svelte-french-toast";

    onMount(() => {
        //sw_register();
        fetchSysContentHash();
    });
</script>

<Toaster />
<slot />
