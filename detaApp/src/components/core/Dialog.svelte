<script lang="ts">
	import { scale } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
	import { IconX } from "@tabler/icons-svelte";
	import { onMount } from "svelte";

	// PROPS
	export let dialog: HTMLDialogElement;

	// HOOKS
	function onClose() {
		storeActiveDialog.set(undefined);
	}

	onMount(() => {
		dialog.showModal();
	});
</script>

<dialog
	bind:this={dialog}
	on:close={onClose}
	transition:scale={{ duration: 500, delay: 0, opacity: 0, start: 0, easing: quintOut }}
>
	<button
		class="closeBtn"
		on:click={() => {
			dialog.close();
		}}
	>
		<IconX
			size={26}
			stroke={2}
		/>
	</button>

	<header class="mb-6 text-2xl font-semibold">
		<slot name="title" />
		<p class="mt-2 max-w-[45ch] text-base font-normal text-neutral-500">
			<slot name="subtitle" />
		</p>
	</header>
	<slot name="body" />
	<footer>
		<slot name="footer" />
	</footer>
</dialog>

<style lang="postcss">
	dialog {
		@apply block rounded-xl bg-white px-8 py-6 shadow-xl;
	}
	.closeBtn {
		@apply absolute top-0 right-0 p-6;
	}

	@media screen and (inx-width: 768px) {
		dialog {
			@apply min-w-[40ch];
		}
	}
</style>
