<script lang="ts">
	import { navigating } from "$app/stores";
</script>

<div id="app-scaffold">
	<slot name="sidebar" />
	<main>
		<slot name="pageHeader" />
		{#key $navigating}
			<div class="h-1 w-full grow">
				<slot name="pageContent" />
			</div>
		{/key}
	</main>
</div>

<style lang="postcss">
	#app-scaffold {
		@apply relative h-full w-full;
		@apply grid;
		grid-template-rows: 100%;
		grid-template-columns: min-content auto;
	}
	main {
		@apply flex h-full max-h-full w-full max-w-full flex-col;
		grid-row: 1;
		grid-column: 2 / 3;
	}

	@media screen and (max-width: 768px) {
		main {
			grid-column: 1 / 3;
		}
	}
</style>
