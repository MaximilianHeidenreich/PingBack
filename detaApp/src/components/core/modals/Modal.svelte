<script lang="ts">
    import { TKN_ICON } from "$lib/utils/tokens";
    import { onMount } from "svelte";

    import { quintOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import IconButton from "../buttons/IconButton.svelte";
    import CloseSquare from "iconsax-svelte/CloseSquare.svelte";
    import { popModal } from "./modalStore";

    // PROPS
    export let dialog: HTMLDialogElement;

    // HOOKS
    function onClose() {
        popModal(); // FIX: multiple modals open -> only close associated
    }

    onMount(() => {
        dialog.showModal();
    });
</script>

<!-- TODO: Click outside close -->
<dialog
    bind:this={dialog}
    on:close={onClose}
    transition:scale={{ duration: 500, delay: 0, opacity: 0, start: 0, easing: quintOut }}>
    <header class="mb-6">
        <div class="flex items-center justify-between gap-4">
            <span class="text-2xl font-semibold"><slot name="title" /></span>
            <IconButton
                clazz="-mr-3"
                on:click={() => {
                    dialog.close();
                }}>
                <CloseSquare  />
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
    dialog {
        @apply block rounded-2xl bg-white px-8 py-6 shadow-xl;
    }

    footer {
        @apply mt-6;
    }

    @media screen and (inx-width: 768px) {
        dialog {
            @apply min-w-[40ch];
        }
    }
</style>
