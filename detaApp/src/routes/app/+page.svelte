<script lang="ts">
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import { onMount } from "svelte";

    s_headerTitle.set("Overview");

    onMount(() => {
        s_projectSidebarActiveProject.set(null);
    });
</script>

<AppContentSection>todo overview stats & latest events</AppContentSection>
