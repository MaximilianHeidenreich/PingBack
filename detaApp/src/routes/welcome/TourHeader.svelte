<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$cmp/core/buttons/Button.svelte";
    import { client_UpdateSysDoc } from "$lib/client/sysdoc";

    // HANDLERS
    async function onSkipTour() {
        try {
            await client_UpdateSysDoc(fetch, { finishedWelcomeTour: true }); // TODO: handle errors
        } catch (e) {
            alert("Could not skip tour! Failed to update sysdoc, contact developer.")
        }
        goto("/");
    }
</script>

<header>
    <div class="flex justify-end mb-4"><Button type="link" style="muted" on:click|once={onSkipTour}>Skip tour</Button></div><!-- TODO: same level with title -->
    <h1 class="text-4xl font-bold mb-4">
        <slot name="title" />
    </h1>
    <p class="leading-relaxed !text-neutral-600">
        <slot name="description" />
    </p>
</header>

<style lang="postcss">
    header {
        @apply mb-8;
    }
</style>
