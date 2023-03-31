<script lang="ts">
    import Tour from "./Tour.svelte";
    import TourBasicEvent from "./TourBasicEvent.svelte";
    import TourWelcome from "./TourWelcome.svelte";

    /*
    TODO: Flow:
    1. Welcome
    2. First event
    3. Adding data
    4. Filtering events
    5. Monitoring events
    6. Have fun!
    */

</script>

<div class="w-full h-full flex justify-center pt-4">
    <div class="max-w-3xl w-full">
        <Tour steps={[
            TourWelcome,
            TourBasicEvent
        ]} />
        <!--<button class="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 active:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg">
        Click me
        </button>-->

    </div>

</div>


<style lang="postcss">

</style>