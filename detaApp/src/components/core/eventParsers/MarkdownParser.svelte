<script lang="ts">
	import type { IEvent } from "$lib/types/IEvent";
    import { compile } from "mdsvex";

    // PROPS
    export let event: IEvent;

    // STATE
    /*let compiled = compile(event.description, {
        smartypants: true,
    })*/

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