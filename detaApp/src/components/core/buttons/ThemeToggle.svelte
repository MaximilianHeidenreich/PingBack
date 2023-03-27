<script lang="ts">
    import Sun1 from "iconsax-svelte/Sun1.svelte";
    import Moon from "iconsax-svelte/Moon.svelte";
    import IconButton from "./IconButton.svelte";

    // STATE
    let isDarkMode = false;

    // HANDLERS
    function onToggle() {
        isDarkMode = !isDarkMode;
        isDarkMode
            ? document.documentElement.classList.add("dark")
            : document.documentElement.classList.remove("dark");

    }

</script>


<IconButton
    on:click={onToggle}>
    {#if isDarkMode}
    <Sun1 size={20}/>
    {:else}
    <Moon size={20}/>
    {/if}
</IconButton>