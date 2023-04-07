<script lang="ts">
    import { browser } from "$app/environment";
    import "$css/app.postcss";
    import { fetchSysContentHash } from "$lib/stores/s_sysContentHash";
    import { s_webNotificationsEnabled, s_webNotificationsEnabled_getState } from "$lib/stores/s_webNotificationsEnabled";
    import { sw_register } from "$lib/utils/serviceWorker";
    import { onMount } from "svelte";
    import { Toaster } from "svelte-french-toast";

    onMount(() => {
        //sw_register();
        fetchSysContentHash();
        // Initiallize browser
        if (!browser) return;
        s_webNotificationsEnabled.set(s_webNotificationsEnabled_getState());
    });
</script>

<Toaster />
<slot />
