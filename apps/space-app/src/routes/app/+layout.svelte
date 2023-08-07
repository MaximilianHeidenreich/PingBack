<script lang="ts">
    import { browser } from "$app/environment";
    import App from "$cmp/core/scaffold/App.svelte";
    import { s_appSidebarCollapsed } from "$cmp/core/scaffold/s_appSidebarCollapsed";
    import { client_DisableLiveData, client_EnableLiveData } from "$lib/client/liveData";
    import { isMobile } from "$lib/utils/width";
    import { onDestroy, onMount } from "svelte";

    onMount(() => {
        s_appSidebarCollapsed.set(isMobile());

        if (!browser) return;
        client_EnableLiveData();
    })
    onDestroy(() => {
        if (!browser) return;
        client_DisableLiveData();
    })
</script>

<App>
    <slot />
</App>
