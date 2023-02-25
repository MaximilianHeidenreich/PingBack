<script lang="ts">
	import Button from "$cmp/core/buttons/Button.svelte";
    import Dialog from "$cmp/core/Dialog.svelte";
	import Input from "$cmp/core/inputs/Input.svelte";
	import { createProject, createProjectChannel } from "$lib/api/apiProjects";
	import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
	import { storeActiveProject, storeActiveProjectID } from "$lib/stores/storeActiveProject";
	import { store_fetchAllProjects } from "$lib/stores/storeProjects";
	import { sanitizeChannelName } from "$lib/utils/sanitizers";
	import toastOptions from "$lib/utils/toast";
	import toast from "svelte-french-toast";
	import { get } from "svelte/store";

    // STATE
    let dialog: HTMLDialogElement;
    let channelName: string;

    // FUNC
    async function submitForm() {
        const projectID = get(storeActiveProject)?.id;
        if (!projectID) {
            toast.error("Internal: No activeProject! Please report issue!", toastOptions({ duration: 6000 }));
            return;
        }

        const res = await createProjectChannel(projectID, {
            name: channelName,
            notify: true, // TODO: add checkbox
        })

        toast.success("Created channel!", toastOptions({}));
        store_fetchAllProjects();

        dialog.close();
    }

</script>

<Dialog bind:dialog>
    <span slot="title">Create Channel</span>
    <span slot="subtitle">
        A channel is used to group related events.
        If you want more information visit the Documentation.
    </span>
    <form slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Channel Name</span>
                <Input 
                    bind:value={channelName} 
                    sanitizer={sanitizeChannelName} 
                    placeholder="logs"/>
            </label>
            <p class="mt-2 px-0.5 leading-5"><small class="mt-1">Allowed characters: lowercase letters, numbers, dashes and underscores</small>.</p>
        </fieldset>
        <fieldset class="flex justify-end gap-4">
            <Button on:click={() => { dialog.close(); }} type="secondary">Cancel</Button>
            <Button on:click={submitForm}>Submit</Button>
        </fieldset>
    </form>
</Dialog>

<style lang="postcss">
    form > fieldset:not(:last-child) {
        @apply mb-6;
    }
</style>