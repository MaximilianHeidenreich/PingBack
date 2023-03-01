<script lang="ts">
    // PROPS
    export let  type: "primary" | "secondary" = "primary",
                color: "main" | "orange" | "red";
</script>

<button
    on:click
    class="{type} {color}">
    <slot />
</button>

<style lang="postcss">
    button {
        /*@apply px-5 py-3 rounded-xl text-white bg-indigo-500;
        @apply flex justify-center items-center;*/
        @apply transition-colors duration-200 ease-in-out;

        @apply mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2;
        @apply text-base font-medium shadow-sm;
        @apply  sm:w-auto sm:text-sm; /* sm:mt-0 sm:ml-3 */
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

    /* COLORS */
    button.primary.main {
        @apply bg-pb-blue-500;
    }
    button.primary.red {
        @apply bg-red-500 border-red-700 text-white;
    }
    button.primary.red:hover {
        @apply bg-red-600 text-white;
    }
    button.primary.red:active {
        @apply bg-red-700 text-white;
    }


    button.secondary.orange {
        @apply border-pb-blue-500;
    }
</style>
