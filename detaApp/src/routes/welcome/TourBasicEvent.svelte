<script lang="ts">
    import TourHeader from "./TourHeader.svelte";
    import WelcomeList from "./WelcomeList.svelte";

</script>
<TourHeader>
    <svelte:fragment slot="title">
        Your first <span class="text-pink-500">event</span>.
    </svelte:fragment>
    <svelte:fragment slot="description">
        To get you started, create your first event. In order to lorem ipsum dolor
        et amet ido sektan rates. sad
    </svelte:fragment>
</TourHeader>

<WelcomeList />
