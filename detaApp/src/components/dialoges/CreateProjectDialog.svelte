<script lang="ts">
	import Button from "$cmp/core/buttons/Button.svelte";
	import Dialog from "$cmp/core/Dialog.svelte";
	import Input from "$cmp/core/inputs/Input.svelte";
	import { createProject } from "$lib/api/apiProjects";
	import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
	import { store_fetchAllProjects } from "$lib/stores/storeProjects";
	import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";
	import toastOptions from "$lib/utils/toast";
	import toast from "svelte-french-toast";

	// STATE
	let dialog: HTMLDialogElement;
	let projectName: string;

	// FUNC
	async function submitForm() {
		const res = await createProject({
			name: projectName
		});

		toast.success("Project created!", toastOptions({}));
		store_fetchAllProjects();

		dialog.close();
	}
</script>

<Dialog bind:dialog>
	<span slot="title">Create Project</span>
	<form slot="body">
		<fieldset>
			<label class="block">
				<span class="text-gray-700">Project Name</span>
				<Input
					bind:value={projectName}
					sanitizer={sanitizeProjectIdInput}
					placeholder="My-Project"
				/>
			</label>
			<p class="mt-2 max-w-[35ch] px-0.5 leading-5">
				<small class="mt-1"
					>Allowed characters: lowercase letters, numbers, dashes and underscores.</small
				>
			</p>
		</fieldset>
		<fieldset class="flex justify-end gap-4">
			<Button
				on:click={() => {
					dialog.close();
				}}
				type="secondary">Cancel</Button
			>
			<Button on:click={submitForm}>Submit</Button>
		</fieldset>
	</form>
</Dialog>

<style lang="postcss">
	form > fieldset:not(:last-child) {
		@apply mb-6;
	}
</style>
