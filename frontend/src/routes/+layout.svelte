<script lang="ts">
    import { browser } from "$app/environment";
    import "$css/app.postcss";
    import { s_clientId } from "$lib/stores/s_clientId";
    import { fetchSysContentHash } from "$lib/stores/s_sysContentHash";
    import { s_webNotificationsEnabled, s_webNotificationsEnabled_getState } from "$lib/stores/s_webNotificationsEnabled";
    import { sw_init, sw_register } from "$lib/utils/serviceWorker";
    import { onMount } from "svelte";
    import { Toaster } from "svelte-french-toast";
    import { get } from "svelte/store";

    onMount(async () => {
        //sw_register();
        fetchSysContentHash();
        // Initiallize browser
        if (!browser) return;
        //if (!get(s_clientId)) s_clientId.set(crypto.randomUUID());
        s_webNotificationsEnabled.set(s_webNotificationsEnabled_getState());

        // Setup service worker
        await sw_register();
        setTimeout(() => sw_init(), 2000);
    });
</script>

<Toaster />
<slot />
