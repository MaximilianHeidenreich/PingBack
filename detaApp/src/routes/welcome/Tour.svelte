<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import { IconChevronLeft, IconChevronRight } from "@tabler/icons-svelte";

    // PROPS
    export let steps: any[] = [];

    // STATE
    let currentStep = 0;

    // HANDLERS
    function onPrevious() {
        currentStep = currentStep -1; // TODO: Fix fisrt
    }
    function onNext() {
        currentStep = currentStep + 1; // Fix end -> callback onLast
    }

</script>

<div class="tour">
    <svelte:component this={steps[currentStep]} />
    <footer>
        <Button style="secondary" clazz="flex justify-center !pl-4 items-center gap-2"
            on:click={onPrevious}><IconChevronLeft size={20}/> <span class="mb-0.5">Previous Step</span></Button>
        <Button clazz="flex justify-center !pr-4 items-center gap-2"
            on:click={onNext}><span class="mb-0.5">Next Step</span> <IconChevronRight size={20}/></Button>
    </footer>
</div>

<style lang="postcss">
    footer {
        @apply flex justify-between items-center mt-6;
    }
</style>