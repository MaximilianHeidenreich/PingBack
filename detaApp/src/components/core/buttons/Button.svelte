<script lang="ts">
    // PROPS
    export let type: "button" | "link" = "button",
        style: "primary" | "secondary" | "link" = "primary",
        color: "pink" | "red" = "pink",
        target: "_blank" | "_self" = "_self",
        href: string = "",
        disabled = false;
</script>

{#if type === "button"}
    <button
        class="{style} col-{color}"
        {...$$restProps}
        {disabled}
        on:click>
        <slot />
    </button>
{:else if type === "link"}
    <a
        {href}
        {target}>
        <slot />
    </a>
{/if}

<style lang="postcss">
    button, a {
        @apply inline-flex items-center justify-center;
        @apply rounded-lg border px-6 py-2.5 text-sm font-medium;
        @apply transition-colors duration-200 ease-in-out;
    }

    /* COLORS */
    /* PRIMARY */
    button.primary.col-pink {
        @apply bg-pink-500 text-white;
    }
    button.primary.col-pink:hover {
        @apply bg-pink-400;
    }
    button.primary.col-pink:active {
        @apply bg-pink-600;
    }

    /* SECONDARY */
    button.secondary {
        @apply text-black;
    }
    button.secondary:hover {
        @apply bg-neutral-100;
    }
    button.secondary:active {
        @apply bg-neutral-200;
    }
</style>
