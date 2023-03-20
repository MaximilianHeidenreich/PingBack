<script lang="ts">
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import type { IProject } from "$lib/types/IProject";
    import { onMount, setContext } from "svelte";
    import type { LayoutData } from "./$types";
    import { navigating } from "$app/stores";

    // PROPS
    export let data: LayoutData;
    $: data: {
        data.project && setContext<IProject>("project", data.project);
        data.project && s_projectSidebarActiveProject.set(data.project);
    }

    // STATE
    data.project && setContext<IProject>("project", data.project);
    data.project && s_projectSidebarActiveProject.set(data.project);
</script>

{#if !data.project}
    <div class="flex w-full flex-col items-center justify-center p-6">
        <span class="text-lg font-medium">Project not found!</span>
        <span class="text-sm"
            ><span class="font-mono">{data.projectID}</span> does not exists!</span>
    </div>
{:else}
    <slot />
{/if}
