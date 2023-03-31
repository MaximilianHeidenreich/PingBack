<script lang="ts">
    // PROPS
    export let type: "button" | "link" = "button",
        style: "primary" | "secondary" | "link" = "primary",
        color: "pink" | "red" = "pink",
        target: "_blank" | "_self" = "_self",
        href: string = "",
        disabled = false,
        clazz: string = "";
</script>

{#if type === "button"}
    <button
        class="{style} col-{color} {clazz}"
        {...$$restProps}
        {disabled}
        on:click>
        <slot />
    </button>
{:else if type === "link"}
    <a
        class="{style} {clazz}"
        {href}
        {target}>
        <slot />
    </a>
{/if}

<style lang="postcss">
    button,
    a {
        @apply inline-flex items-center justify-center;
        @apply rounded-lg px-6 py-2.5 text-sm font-medium;
        @apply transition-colors duration-200 ease-in-out;
    }

    /* COLORS */
    /* PRIMARY */
    button.primary.col-pink {
        @apply border-2 border-pink-400 bg-gradient-to-b from-pink-400 to-pink-500 text-white;
    }
    button.primary.col-pink:hover {
        @apply from-pink-400 to-pink-400;
    }
    button.primary.col-pink:active {
        @apply from-pink-500 to-pink-600;
    }

    button.primary.col-red {
        @apply bg-red-500 text-white;
    }
    button.primary.col-red:hover {
        @apply bg-red-400;
    }
    button.primary.col-red:active {
        @apply bg-red-600;
    }

    /* SECONDARY */
    button.secondary,
    a.secondary {
        @apply text-black;
    }
    button.secondary:hover,
    a.secondary:hover {
        @apply bg-neutral-100;
    }
    button.secondary:active,
    a.secondary:active {
        @apply bg-neutral-200;
    }

    /* LINK */
    button.link, a.link {
        @apply text-pink-500 underline underline-offset-4 p-0;
    }
    button.link:hover, a.link:hover {
        @apply text-pink-600;
    }
</style>
