<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { clientDeleteProjectRaw } from "$lib/helpers/api/projectsClient";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let apiKey: string,
        keyName: string,
        onDeleted: () => void;

    // STATE
    let dialog: HTMLDialogElement;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onDelete() {
        /*const res = await clientDe(fetch, projectID);
        console.debug("Delete api key fetch result", res);

        if (res.status === 200) {
            toast.success("Deleted project!", toastOptions());
        }
        else {
            toast.error("Could not delete project!", toastOptions());
        }

        s_appSidebarFetchAllProjects();*/ // TODO IMPL
        dialog.close();
        onDeleted && onDeleted();
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Delete Api Key</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Are you sure you want to delete <strong class="text-pink-500">{keyName}</strong>?
        This action cannot be reversed and access for all applications using this key will be revoked.
    </svelte:fragment>
    <svelte:fragment slot="footer">
    <div class="flex justify-end gap-4">
        <Button style="secondary" on:click={onCancel}>Cancel</Button>
        <Button on:click={onDelete} color="red">Delete</Button>
    </div>
    </svelte:fragment>
</Modal>