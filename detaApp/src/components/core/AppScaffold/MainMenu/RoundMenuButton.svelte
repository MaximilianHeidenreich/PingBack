<script lang="ts">

    // PROPS
    export let  type: "button" | "link" = "button",
                href: string | undefined = undefined,
                target: string = "_self";

</script>

{#if type === "button"}
<button
    on:click
    class="reset">
    <slot/>
</button>
{:else if type === "link"}
<a {href} {target} class="reset">
    <slot/>
</a>
{/if}

<style lang="postcss">
    a, button {
        @apply w-16 aspect-square rounded-full border-transparent;
        @apply flex justify-center items-center;
        @apply transition-colors duration-100 ease-in-out;
    }
    a:not(.active):hover, button:not(.active):hover {
        @apply text-black bg-neutral-100 border-2 border-neutral-200;
    }
    a:not(.active):active, button:not(.active):active {
        @apply text-black bg-neutral-200;
    }

    @media screen and (max-width: 768px) {
        a, button {
            @apply w-12;
        }
    }
</style>