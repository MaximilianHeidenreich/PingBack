<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$cmp/core/buttons/Button.svelte";
    import IconArrowsButtonRight from "$cmp/core/icons/IconArrowsButtonRight.svelte";
    import IconArrowsButtonLeft from "$cmp/core/icons/IconArrowsButtonLeft.svelte";
    import { client_UpdateSysDoc } from "$lib/client/sysdoc";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import { fly } from "svelte/transition";

    // PROPS
    export let steps: any[] = [];

    // STATE
    let currentStep = 0;

    // HANDLERS
    function onPrevious() {
        if (currentStep - 1 <= 0) currentStep = 0;
        else currentStep = currentStep -1;
}
    function onNext() {
        if (currentStep + 1 === steps.length) {
            onFinish();
            return;
        }
        currentStep = currentStep + 1; // Fix end -> callback onLast
    }
    async function onFinish() {
        try {
            await client_UpdateSysDoc(fetch, { finishedWelcomeTour: true }); // TODO: handle errors
        } catch(e) {
            console.error(e);
            alert("Fatal error: Could not finish tour! Please contact developer.");
            return;
        }
        goto("/");
    }

</script>

<div class="tour">
    <svelte:component this={steps[currentStep]} />
    <!--<div class="w-full h-full flex justify-center items-center"
        in:fly={{
            duration: TKN_TRANSITION.DURATION + 200,
            easing: TKN_TRANSITION.EASING,
            x: 30, delay: 800
        }}
        out:fly={{
            duration: TKN_TRANSITION.DURATION + 200,
            easing: TKN_TRANSITION.EASING,
            x: -30
        }}>
    </div>-->
    <footer>
        {#if currentStep > 0}
        <Button type="normal" style="muted" clazz="flex justify-center !pl-4 items-center gap-2"
            on:click={onPrevious}><IconArrowsButtonLeft size={TKN_ICON.SIZE.XS} style="dark"/> <span class="mb-0.5">Go Back</span></Button>
        {:else}
        <span></span> <!-- spacer placeholder.. we just pretend flexbox css does not exist -->
        {/if}
        <Button
            on:click={onNext}>
            {#if currentStep === steps.length - 1}
                <span class="mb-0.5">Finish</span> <span>🎉</span>
            {:else}
                <span class="mb-0.5">Continue</span> <IconArrowsButtonRight size={TKN_ICON.SIZE.XS} style="light"/>
            {/if}
        </Button>
    </footer>
</div>

<style lang="postcss">
    .tour {
        @apply w-full flex flex-col justify-between items-stretch;
    }
    footer {
        @apply flex justify-between items-center mt-6;
    }
</style>

