<script lang="ts">
    import TourHeader from "./TourHeader.svelte";
    import WelcomeList from "./WelcomeList.svelte";

</script>
<TourHeader>
    <svelte:fragment slot="title">
        Welcome to <span class="text-pink-500">Ping</span>Back.
    </svelte:fragment>
    <svelte:fragment slot="description">
        To get you started, the following five steps will guide you through the basics of PingBack.
        Further information and advanced features can be found inside our <a href="/docs" target="_blank" class="pretty-link">documentation</a>.
    </svelte:fragment>
</TourHeader>


<WelcomeList />
