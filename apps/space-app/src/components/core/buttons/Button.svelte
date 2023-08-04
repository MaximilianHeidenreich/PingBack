<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Spinner from "../utils/Spinner.svelte";


    // PROPS
    export let type: "normal" | "ghost" | "link" = "normal",
        style: "normal" | "muted" | "red" = "normal",
        loading: boolean = false,
        disabled: boolean = false,
        btnClazz: string = "";

    // STATE
    const dispatch = createEventDispatcher();

    // HANDLERS
    /*function click(event: Event) {
        dispatch("click", event);
    }*/ // TODO: FIx

</script>

<button class="{type} s-{style} {btnClazz}" class:loading class:disabled on:click {disabled}>
    <span class="content flex justify-center items-center gap-3"><slot /></span>
    {#if loading}
    <span class="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center"><Spinner color="{style === "muted" ? 'dark' : 'light'}"/></span>
    {/if}
</button>

<style lang="postcss">
    button {
        @apply text-white font-medium rounded-xl;
        @apply px-5 py-3 w-fit min-w-max;
        @apply scale-100;
        transition: all 0.05s ease-in-out, background 0.15s ease-in-out;
    }

    button.loading {
        @apply cursor-wait;
    }
    button.loading .content {
        @apply opacity-0;
    }
    button.disabled {
        @apply cursor-not-allowed;
    }

    /* TYPES */
    /*button.ghost {
        @apply ;
    }*/
    button:not(.disabled, .loading).ghost:hover {
        @apply bg-neutral-100;
    }
    button:not(.disabled, .loading).ghost:active {
        @apply bg-neutral-200;
    }

    button:not(.disabled, .loading):active {
        @apply translate-y-0.5 scale-[0.96];
    }

    /* STYLES */
    /* S-NORMAL */
    button.s-normal {
        @apply bg-[#2F2B43] bg-[#082e47] bg-[#343c96] bg-[#3d2ed9] bg-blub-500 border-2 border-blue-800;
    }
    button.s-normal.disabled {
       @apply !bg-gray-600 !text-gray-500;
    }

    /* S-MUTED */
    button:not(.ghost).s-muted {
        @apply border bg-gray-50 text-black;
    }
    button.s-muted.disabled {
       @apply !text-gray-400;
    }


    button.s-red {
        @apply bg-red-500;
    }

</style>
