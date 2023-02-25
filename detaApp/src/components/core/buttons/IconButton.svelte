<script lang="ts">

    // PROPS
    export let  disabled: boolean = false,
                type: "button" | "link" = "button",
                href: string = "#";

</script>

{#if type === "button"}
<button
    on:click
    {disabled} {...$$restProps}>
    <slot name="icon"/>
</button>
{:else if type === "link"}
<a {href} class:disabled {...$$restProps}>
    <slot name="icon"/>
</a>
{/if}

<style lang="postcss">
    a, button {
        @apply p-2.5 rounded-xl text-black;
        @apply flex justify-center items-center;
        @apply transition-colors ease-in-out duration-200;
    }
    a:disabled, button:disabled {
        @apply text-neutral-400 cursor-not-allowed;
    }
    a:focues, button:focus {

    }
    a:not(:disabled):hover, button:not(:disabled):hover {
        @apply bg-neutral-100;
    }
    a:not(:disabled):active, button:not(:disabled):active {
        @apply bg-neutral-200;
    }
</style>