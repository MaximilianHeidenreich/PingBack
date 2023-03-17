<script lang="ts">
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fade } from "svelte/transition";
    import { s_activeModals } from "./modalStore";


</script>

<div>

    {#each $s_activeModals as modal}
    <div
        class="dialogPortal"
        transition:fade={{
            delay: 0,
            duration: TKN_TRANSITION.DURATION,
            easing: TKN_TRANSITION.EASING
        }}>
        <svelte:component this={modal} />
    </div>
    {/each}

</div>