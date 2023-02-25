<script lang="ts">
	import { goto } from "$app/navigation";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { IconFidgetSpinner } from "@tabler/icons-svelte";
	import { onMount } from "svelte";



    // HOOKS
    onMount(() => {
        goto("/app/dashboard", { replaceState: true });
    });

</script>

<div class="w-full h-full flex justify-center items-center">
    <div class="animate-spin p-1">
        <IconFidgetSpinner size={ICON_TOKENS.SIZE.LG} stroke={ICON_TOKENS.STROKE.BASE}/>
    </div>
</div>
