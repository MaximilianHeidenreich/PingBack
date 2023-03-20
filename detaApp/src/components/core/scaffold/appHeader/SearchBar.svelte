<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconX } from "@tabler/icons-svelte";
    import { createEventDispatcher } from "svelte";

    // STATE
    const dispatch = createEventDispatcher();

    // HANDLERS
    function onCloseBtn() {
        dispatch("close");
    }
</script>

<div
    class="flex flex-1 items-center justify-between rounded-xl border-2 border-neutral-300 bg-white py-2 px-2">
    <span class="ml-2"> search coming soon </span>
    <IconButton on:click={onCloseBtn}>
        <IconX
            size={TKN_ICON.SIZE.SM}
            stroke={TKN_ICON.STROKE.LG} />
    </IconButton>
</div>
