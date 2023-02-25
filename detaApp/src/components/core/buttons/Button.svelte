<script lang="ts">
    // PROPS
    export let type: "primary" | "secondary" = "primary";
</script>

<button
    on:click
    class={type}>
    <slot />
</button>

<style lang="postcss">
    button {
        /*@apply px-5 py-3 rounded-xl text-white bg-indigo-500;
        @apply flex justify-center items-center;*/
        @apply transition-colors duration-200 ease-in-out;

        @apply mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2;
        @apply text-base font-medium shadow-sm;
        @apply sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm;
    }
    button:disabled {
        @apply cursor-not-allowed;
    }
    button:focus {
        @apply outline-none;
    }

    /* PRIMARY */
    button.primary {
        @apply border-neutral-300 bg-[#20282f] text-white;
    }
    button.primary:disabled {
        @apply text-neutral-400;
    }
    button.primary:not(:disabled):hover {
        @apply bg-neutral-100 text-neutral-800;
    }
    button.primary:not(:disabled):active {
        @apply bg-neutral-200;
    }

    /* SECONDARY */
    button.secondary {
        @apply border-neutral-200 bg-neutral-50 text-neutral-700;
    }
    button.secondary:disabled {
        @apply bg-neutral-400 text-neutral-600;
    }
    button.secondary:not(:disabled):hover {
        @apply bg-neutral-100 text-neutral-800;
    }
    button.secondary:not(:disabled):active {
        @apply border-neutral-100 bg-neutral-200;
    }
</style>
