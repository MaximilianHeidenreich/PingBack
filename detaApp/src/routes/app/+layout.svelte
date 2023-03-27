<script lang="ts">
    import App from "$cmp/core/scaffold/App.svelte";
    import { s_appSidebarCollapsed } from "$cmp/core/scaffold/s_appSidebarCollapsed";
    import { onMount } from "svelte";

    onMount(() => {
        const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        s_appSidebarCollapsed.set(width < 768);
    })
</script>

<App>
    <slot />
</App>
