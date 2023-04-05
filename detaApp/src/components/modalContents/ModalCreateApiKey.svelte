<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { client_CreateApiKey } from "$lib/client/apiKey";
    import { NotFound } from "$lib/errors/core";
    import { sanitizeApiKeyNameInput } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let projectKey: string, onCreated: () => void;

    // STATE
    let dialog: HTMLDialogElement;
    let keyName: string; // TODO: Rename to name
    let working = false;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        working = true;
        try {
            const res = await client_CreateApiKey(fetch, { project: projectKey, displayName: keyName });
        } catch (e) {
            toast.error("Could not create API key!", toastOptions());
            if (e instanceof NotFound) alert(e);
            console.error(e);
            working = false;
            return;
        }
        toast.success("Created API key!", toastOptions());
        dialog.close();
        onCreated && onCreated();
        working = false;
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Api Key</svelte:fragment>
    <svelte:fragment slot="subtitle">
        API Keys are used to authenticate requests to your project. You cannot create events without
        an API Key. Visit the <a
            href="https://maximilianheidenreich.gitbook.io/pingback/"
            target="_blank"
            class="pretty-link">documentation</a>
        for more information. <!-- TODO: Link -->
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Key Name</span>
                <Input
                    bind:value={keyName}
                    sanitizer={sanitizeApiKeyNameInput}
                    placeholder="Example Application" />
            </label>
            <p class="mt-2 px-0.5 leading-5">
                <small class="mt-1">
                    Use a descriptive name for your key (max. 25 chars). <br>This will help you identify it later.
                </small>
            </p>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="muted"
                on:click={onCancel}>Cancel</Button>
            <Button
            on:click={onCreate}
                loading={working}>Create</Button>
        </div>
    </svelte:fragment>
</Modal>
