<script lang="ts">
	import { navigating } from "$app/stores";


    // PROPS
    export let  type: "button" | "link" = "button",
                href: string = "#",
                isActiveParser: (url: URL | undefined) => boolean = () => false;
    
    // STATE
    $: isActive = false//$navigating !== undefined && new URL(window?.location.href).pathname.includes(href);
    $: $navigating && console.log("navigating ", $navigating);

</script>

{#if type === "button"}
<button
    on:click
    class="{isActive ? 'active' : ''} active">
    <slot/>
</button>
{:else if type === "link"}
<a {href} class="{isActive ? 'active' : ''}">
    <slot/>
</a>
{/if}

<style lang="postcss">
    a,button {
        @apply aspect-square w-16 rounded-full;
        @apply flex justify-center items-center;
        @apply transition-colors duration-200 ease-in-out;
    }
    a.active, button.active {
        @apply text-white bg-[#20282f];
    }
    a.active:hover, button.active:hover {
        @apply cursor-default pointer-events-none;
    }
    a:not(.active):hover, button:not(.active):hover {
        @apply text-black bg-neutral-100;
    }
    a:not(.active):active, button:not(.active):active {
        @apply text-black bg-neutral-200;
    }
</style>