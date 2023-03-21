<script lang="ts">
    // PROPS
    export let href: string = "", active: boolean = false, disabled: boolean = false;
</script>

<a {href} class:active class:disabled>
    <slot />
</a>

<style lang="postcss">
    a {
        @apply flex w-full justify-start items-center gap-3 rounded-xl py-2.5 px-4;
        @apply transition-colors duration-200 ease-in-out;

        @apply font-medium text-neutral-700;
    }
    a:not(.disabled).active {
        @apply bg-neutral-100;
    }
    a:not(.disabled):hover {
        @apply bg-neutral-100;
    }
    a:not(.disabled):active {
        @apply bg-neutral-200;
    }

    a.disabled {
        @apply text-neutral-400;
    }
    a.disabled:hover {
        @apply cursor-not-allowed;
    }
</style>