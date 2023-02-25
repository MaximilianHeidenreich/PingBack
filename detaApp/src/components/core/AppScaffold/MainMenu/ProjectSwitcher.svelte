<script lang="ts">
	import { goto } from "$app/navigation";
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import type { IProject } from "$lib/types/IProject";
	import RoundMenuButton from "./RoundMenuButton.svelte";

	// PROPS
	export let projects: IProject[];

	// UTILS
	function generateProjectDisplayName(project: IProject): string {
		return project.id.slice(0, 2).toUpperCase();
	}

	// HANDLERS
	function onPickProject(project: IProject): void {
		goto(`/app/dashboard/${project.id}/feed`);
		storeActiveProject.set(project);
	}
</script>

<div class="h-max w-full">
	<ul class="flex flex-col gap-4">
		{#each projects as project}
			<li>
				<RoundMenuButton
					type="button"
					on:click={() => onPickProject(project)}
				>
					<span class="font-mono">{generateProjectDisplayName(project)}</span>
				</RoundMenuButton>
			</li>
		{/each}
	</ul>
</div>
