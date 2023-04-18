<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { fly } from "svelte/transition";

    // PROPS

    // STATE
    const dispatch = createEventDispatcher();

</script>

<slot name="header" />
<!--
transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        x: -30
    }}>
-->
<div class="w-full h-full flex justify-center items-center">
    <slot />
</div>

