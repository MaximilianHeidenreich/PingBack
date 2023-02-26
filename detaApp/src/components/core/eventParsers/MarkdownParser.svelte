<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";

    // PROPS
    export let event: IEvent;
</script>

<div>
    <!--{#await compiled}
        <p>Loading...</p>
    {:then result}
        {@html result}
    {:catch error}
        <p>{error.message}</p>
    {/await}-->
</div>
