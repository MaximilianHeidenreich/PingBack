<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    // HOOKS
    onMount(() => {
        goto("/app", { replaceState: true });
    });
</script>

<div class="flex h-full w-full items-center justify-center">
    <!--<div class="animate-spin p-1">
        <IconFidgetSpinner
            size={ICON_TOKENS.SIZE.LG}
            stroke={ICON_TOKENS.STROKE.BASE} />
    </div>-->
    todo laoding
</div>
