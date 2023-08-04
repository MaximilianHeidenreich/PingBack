<script lang="ts">
    import { browser } from "$app/environment";
    import App from "$cmp/core/scaffold/App.svelte";
    import { s_appSidebarCollapsed } from "$cmp/core/scaffold/s_appSidebarCollapsed";
    import { client_EnableLiveData } from "$lib/client/liveData";
    import { isMobile } from "$lib/utils/width";
    import { onMount } from "svelte";

    onMount(() => {
        s_appSidebarCollapsed.set(isMobile());

        if (!browser) return;
        client_EnableLiveData();
    })
</script>

<App>
    <slot />
</App>
