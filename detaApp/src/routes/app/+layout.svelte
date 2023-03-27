<script lang="ts">
    import App from "$cmp/core/scaffold/App.svelte";
    import { s_appSidebarCollapsed } from "$cmp/core/scaffold/s_appSidebarCollapsed";
    import { isMobile } from "$lib/utils/width";
    import { onMount } from "svelte";

    onMount(() => {
        s_appSidebarCollapsed.set(isMobile());
    })
</script>

<App>
    <slot />
</App>
