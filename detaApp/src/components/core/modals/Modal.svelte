<script lang="ts">
    import { IconX } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    import { quintOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import IconButton from "../buttons/IconButton.svelte";
    import { popModal } from "./modalStore";

    // STATE
    let dialog: HTMLDialogElement;

    // HOOKS
    function onClose() {
        popModal(); // FIX: multiple modals open -> only close associated
    }

    onMount(() => {
        dialog.showModal();
    });
</script>

<dialog
    bind:this={dialog}
    on:close={onClose}
    transition:scale={{ duration: 500, delay: 0, opacity: 0, start: 0, easing: quintOut }}>
    <header class="mb-6">
        <div class="flex justify-between items-center gap-4">
            <span class="text-2xl font-semibold"><slot name="title" /></span>
            <IconButton class="btn-close" on:click={() => { dialog.close(); }}>
            <IconX
                size={26}
                stroke={2} />
            </IconButton>
        </div>
        <p class="mt-2 max-w-[45ch] text-base font-normal text-neutral-500">
            <slot name="subtitle" />
        </p>
    </header>
    <slot name="body" />
    <footer>
        <slot name="footer" />
    </footer>
</dialog>

<style lang="postcss">

</style>