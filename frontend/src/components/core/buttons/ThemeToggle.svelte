<script lang="ts">
    import IconButton from "./IconButton.svelte";
    import { s_darkMode } from "$lib/stores/s_darkMode";
    import { get } from "svelte/store";
    import IconWeatherMoon from "../icons/IconWeatherMoon.svelte";
    import IconWeatherSun from "../icons/IconWeatherSun.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";

    // PROPS
    export let iconSize = TKN_ICON.SIZE.SM;

    // HANDLERS
    function onToggle() {
        s_darkMode.set(!get(s_darkMode));
        $s_darkMode
            ? document.documentElement.classList.add("dark")
            : document.documentElement.classList.remove("dark");

    }
</script>


<IconButton
    disabled
    on:click={onToggle}>
    {#if $s_darkMode}
    <IconWeatherSun size={iconSize} style="currentColor"/>
    {:else}
    <IconWeatherMoon size={iconSize} style="currentColor"/>
    {/if}
</IconButton>
