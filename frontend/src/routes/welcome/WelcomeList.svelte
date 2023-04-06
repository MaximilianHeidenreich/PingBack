<script lang="ts">
    import Notification from "$cmp/notification/Notification.svelte";




</script>

<div class="wrapper">
    <ul>
        <li><Notification /></li>
        <li><Notification /></li>
        <li><Notification /></li>
        <li><Notification /></li>
        <li><Notification /></li>
        <li><Notification /></li>
    </ul>
</div>

<style lang="postcss">
    .wrapper {
        @apply flex justify-center p-6;
        @apply border rounded-3xl min-h-[40ch] max-h-[40ch] overflow-y-auto bg-blue-50;
    }
    .wrapper > ul {
        @apply flex flex-col gap-3;
    }
</style>