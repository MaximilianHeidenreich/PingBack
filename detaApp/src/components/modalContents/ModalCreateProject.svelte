<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";

    // STATE
    let dialog: HTMLDialogElement;
    let projectName: string;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    function onCreate() {

    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Project</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Use projects to split events, metrics and monitors into separate groups.
        Visit the <a href="https://maximilianheidenreich.gitbook.io/pingback/" target="_blank" class="pretty-link">documentation</a> for more information. <!-- TODO: Link -->
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Project Name</span>
                <Input
                    bind:value={projectName}
                    sanitizer={sanitizeProjectIdInput}
                    placeholder="My-Project" /> <!-- TODO: space input should auto replace on input -->
            </label>
            <p class="mt-2 max-w-[35ch] px-0.5 leading-5">
                <small class="mt-1">
                    Allowed characters: lowercase letters, numbers, dashes and underscores.
                </small>
            </p>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="footer">
    <div class="flex justify-end gap-4">
        <Button style="secondary" on:click={onCancel}>Cancel</Button>
        <Button>Create</Button>
    </div>
    </svelte:fragment>
</Modal>