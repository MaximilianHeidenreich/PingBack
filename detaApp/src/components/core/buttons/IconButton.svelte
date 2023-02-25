<script lang="ts">
	// PROPS
	export let disabled: boolean = false,
		type: "button" | "link" = "button",
		href: string = "#";
</script>

{#if type === "button"}
	<button
		on:click
		{disabled}
		{...$$restProps}
	>
		<slot name="icon" />
	</button>
{:else if type === "link"}
	<a
		{href}
		class:disabled
		{...$$restProps}
	>
		<slot name="icon" />
	</a>
{/if}

<style lang="postcss">
	a,
	button {
		@apply rounded-xl p-2.5 text-black;
		@apply flex items-center justify-center;
		@apply transition-colors duration-200 ease-in-out;
	}
	a:disabled,
	button:disabled {
		@apply cursor-not-allowed text-neutral-400;
	}
	a:focues,
	button:focus {
	}
	a:not(:disabled):hover,
	button:not(:disabled):hover {
		@apply bg-neutral-100;
	}
	a:not(:disabled):active,
	button:not(:disabled):active {
		@apply bg-neutral-200;
	}
</style>
