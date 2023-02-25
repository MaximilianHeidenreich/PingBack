<script lang="ts">
	// PROPS
	export let type: "button" | "link" = "button",
		href: string | undefined = undefined,
		target: string = "_self";
</script>

{#if type === "button"}
	<button
		on:click
		class="reset"
	>
		<slot />
	</button>
{:else if type === "link"}
	<a
		{href}
		{target}
		class="reset"
	>
		<slot />
	</a>
{/if}

<style lang="postcss">
	a,
	button {
		@apply aspect-square w-16 rounded-full border-transparent;
		@apply flex items-center justify-center;
		@apply transition-colors duration-100 ease-in-out;
	}
	a:not(.active):hover,
	button:not(.active):hover {
		@apply border-2 border-neutral-200 bg-neutral-100 text-black;
	}
	a:not(.active):active,
	button:not(.active):active {
		@apply bg-neutral-200 text-black;
	}

	@media screen and (max-width: 768px) {
		a,
		button {
			@apply w-12;
		}
	}
</style>
