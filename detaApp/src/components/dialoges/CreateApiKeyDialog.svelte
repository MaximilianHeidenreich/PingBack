<script lang="ts">
	import { invalidate } from "$app/navigation";
	import Button from "$cmp/core/buttons/Button.svelte";
	import Dialog from "$cmp/core/Dialog.svelte";
	import Input from "$cmp/core/inputs/Input.svelte";
	import { createApiKey } from "$lib/api/apiApiKeys";
	import { storeActiveProject } from "$lib/stores/storeActiveProject";
	import { store_fetchAllProjects } from "$lib/stores/storeProjects";
	import toastOptions from "$lib/utils/toast";
	import toast from "svelte-french-toast";
	import { get } from "svelte/store";

	// STATE
	let dialog: HTMLDialogElement;
	let keyName: string;

	// FUNC
	async function submitForm() {
		const action = async () => {
			if (get(storeActiveProject) === undefined)
				throw new Error("No active project! (Please report issue!)");
			await createApiKey({
				name: keyName,
				project: get(storeActiveProject)!.id
			});

			store_fetchAllProjects();
			invalidate("apiKeys");
		};
		toast.promise(
			action(),
			{
				loading: "Creating Api Key...",
				success: "Api Key created!",
				error: "Something went wrong!"
			},
			toastOptions()
		);

		dialog.close();
	}
</script>

<Dialog bind:dialog>
	<span slot="title">New API Key</span>
	<form slot="body">
		<fieldset>
			<label class="block">
				<span class="text-gray-700">Key Name</span>
				<Input
					bind:value={keyName}
					placeholder="Example Client"
				/>
			</label>
			<p class="mt-2 max-w-[35ch] px-0.5 leading-5">
				<small class="mt-1"
					>Give the name a unique key, so that you know where it is used later on.</small
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
