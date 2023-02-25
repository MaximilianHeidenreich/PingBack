<script lang="ts">
    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { IconFidgetSpinner } from "@tabler/icons-svelte";
	import { ICON_TOKENS } from "$lib/utils/tokens";

    // PROPS
    export let  data: PageData;
    
    // STATE
    let projectId = data.projectId;

    onMount(() => goto(`/app/dashboard/${projectId}/feed`));
</script>

<div class="w-full h-full flex justify-center items-center">
    <div class="animate-spin p-1">
        <IconFidgetSpinner size={ICON_TOKENS.SIZE.LG} stroke={ICON_TOKENS.STROKE.BASE}/>
    </div>
</div>