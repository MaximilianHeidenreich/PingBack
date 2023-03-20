<script lang="ts">
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import { onMount } from "svelte";

    s_headerTitle.set("Global Settings");

    // HOOKS
    onMount(() => {
        s_projectSidebarActiveProject.set(null);
    });
</script>

<section>
    <header>
        <span class="title">Cache</span>
    </header>
</section>
