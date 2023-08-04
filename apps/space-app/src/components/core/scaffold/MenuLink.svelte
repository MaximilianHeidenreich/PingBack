<script lang="ts">
    // PROPS
    export let href: string = "", active: boolean = false, disabled: boolean = false;
</script>

<a {href} class:active class:disabled on:click>
    <slot />
</a>

<style lang="postcss">
    a {
        @apply flex w-full justify-start items-center gap-3 rounded-xl py-2.5 px-4;
        @apply font-medium text-neutral-700 border-2 border-transparent;
        @apply transition-colors duration-200 ease-in-out;
    }
    a:not(.disabled).active {
        @apply bg-neutral-100 text-blub-600;
    }
    a:not(.disabled, .active):hover {
        @apply border-neutral-200 bg-neutral-50; /*bg-neutral-100;*/
    }
    a:not(.disabled):active {
        @apply bg-neutral-200;
    }

    a.disabled {
        @apply text-neutral-400 pointer-events-none;
    }
    a.disabled:hover {
        @apply cursor-not-allowed;
    }
</style>
