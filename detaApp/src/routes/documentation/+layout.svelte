<script>
	import IconButton from "$cmp/core/buttons/IconButton.svelte";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { IconBrandGithub } from "@tabler/icons-svelte";
	import detaLogo from "$lib/assets/detalogo.svg";
</script>

<main id="documentation-wrapper">
	<aside>
		<div>
			<header>
				<h1>Documentation</h1>
			</header>
		</div>
		<footer>
			<ul class="flex items-center gap-1">
				<li>
					<IconButton
						type="link"
						href="/"
					>
						<IconBrandGithub
							slot="icon"
							size={ICON_TOKENS.SIZE.BASE}
							stroke={ICON_TOKENS.STROKE.BASE}
						/>
					</IconButton>
				</li>
				<li>
					<IconButton
						type="link"
						href="/"
					>
						<img
							slot="icon"
							src={detaLogo}
							alt="Deta Logo"
							class="aspect-square w-7"
						/>
					</IconButton>
				</li>
			</ul>
		</footer>
	</aside>
	<div class="content-area">
		<slot />
	</div>
</main>

<style lang="postcss">
	main {
		@apply relative h-full w-full;
		@apply grid;
		grid-template-rows: 100%;
		grid-template-columns: min-content auto;
	}

	aside {
		grid-row: 1;
		grid-column: 1 / 2;
		@apply border-r-2 border-neutral-200 bg-white px-10 py-8;
		@apply flex flex-col justify-between;
	}
	.content-area {
		@apply flex h-full max-h-full w-full flex-col p-8;
		grid-row: 1;
		grid-column: 2 / 3;
	}

	#documentation-wrapper :global(h1) {
		@apply mb-4 text-3xl font-bold;
	}
	#documentation-wrapper :global(section + section) {
		@apply mt-10;
	}
</style>
