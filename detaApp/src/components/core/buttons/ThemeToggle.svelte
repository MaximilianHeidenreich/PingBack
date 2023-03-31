<script lang="ts">
    import Sun1 from "iconsax-svelte/Sun1.svelte";
    import Moon from "iconsax-svelte/Moon.svelte";
    import IconButton from "./IconButton.svelte";
    import { s_darkMode } from "$lib/stores/s_darkMode";
    import { get } from "svelte/store";

    // HANDLERS
    function onToggle() {
        s_darkMode.set(!get(s_darkMode));
        $s_darkMode
            ? document.documentElement.classList.add("dark")
            : document.documentElement.classList.remove("dark");

    }
</script>


<IconButton
    on:click={onToggle}>
    {#if $s_darkMode}
    <Sun1 size={20}/>
    {:else}
    <Moon size={20}/>
    {/if}
</IconButton>