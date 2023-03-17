<script lang="ts">
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import type { IProject } from "$lib/types/IProject";
    import { setContext } from "svelte";
    import type { LayoutData } from "./$types";
    import { navigating } from "$app/stores";

    // PROPS
    export let data: LayoutData;

    // STATE
    data.project && setContext<IProject>("project", data.project);
    data.project && s_projectSidebarActiveProject.set(data.project);
</script>

{#key $navigating}
{#if !data.project}
<div class="w-full p-6 flex flex-col justify-center items-center">
    <span class="text-lg font-medium">Project not found!</span>
    <span class="text-sm"><span class="font-mono">{data.projectID}</span> does not exists!</span>
</div>
{:else}
<slot/>
{/if}
{/key}