<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";

    s_headerTitle.set("Overview");
    s_projectSidebarActiveProject.set(null);
</script>

<div>
foo bar
<br /><br />
<Button>Sign-In</Button>
</div>
<div class=" bg-green-300" style="height: 130vh">asd</div>
