<script lang="ts">
    import { TKN_ICON } from "$lib/utils/tokens";
    import { get } from "svelte/store";
    import IconArrowsExpand1 from "../icons/IconArrowsExpand1.svelte";
    import IconArrowsShrink1 from "../icons/IconArrowsShrink1.svelte";
    import { s_appFullscreen } from "../scaffold/s_appFullscreen";
    import IconButton from "./IconButton.svelte";

</script>

<IconButton on:click={() => s_appFullscreen.set(!get(s_appFullscreen))}>
    {#if $s_appFullscreen}
    <IconArrowsShrink1 size={TKN_ICON.SIZE.SM} />
    {:else}
    <IconArrowsExpand1 size={TKN_ICON.SIZE.SM} />
    {/if}
</IconButton>

