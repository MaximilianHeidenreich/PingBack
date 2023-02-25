<script lang="ts">
    import type { IEvent } from "$lib/types/IEvent";

    // PROPS
    export let event: IEvent;
</script>

<pre>
{JSON.stringify(event.tags, null, 2)}
</pre>
