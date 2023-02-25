<script lang="ts">
	import type { IEvent } from "$lib/types/IEvent";


    // PROPS
    export let  event: IEvent;
</script>

<span class="leading-normal">
    {event.description}
</span>