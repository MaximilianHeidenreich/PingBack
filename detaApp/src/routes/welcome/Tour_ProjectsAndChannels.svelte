<script lang="ts">
    import TourHeader from "./TourHeader.svelte";
    import TourStep from "./TourStep.svelte";
</script>

<TourStep>
    <svelte:fragment slot="header">
        <TourHeader>
            <svelte:fragment slot="title">
                <span class="text-pink-500">Projects</span> and <span class="text-pink-500">Channels</span>.
            </svelte:fragment>
            <svelte:fragment slot="description">
                Each event has to be associated with a <b>channel</b> which itself is part of a <b>project</b>.
                This separates events into distinct groups which you can easily filter, manage and create metrics for.
                <br>
                To get started, we created a "default" project with a "default" channel and API key for you to use.
            </svelte:fragment>
        </TourHeader>
    </svelte:fragment>
</TourStep>

