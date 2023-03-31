<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { clientCreateProjectChannelRaw } from "$lib/helpers/api/projectsClient";
    import type { IProject } from "$lib/types/IProject";
    import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let project: IProject, onCreated: () => void;

    // STATE
    let dialog: HTMLDialogElement;
    let channelID: string;
    let working = false;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        working = true;
        const res = await clientCreateProjectChannelRaw(
            fetch,
            sanitizeProjectIdInput(project.key),
            { id: channelID }
        );

        if (res.status === 200) {
            toast.success(`Created channel #${channelID}!`, toastOptions());
            dialog.close();
            onCreated && onCreated();
            return;
        } else if (res.status === 400) {
            console.error(await res.json());
            toast.error("Could not create channel!", toastOptions());
        } else if (res.status === 409) {
            toast.error(`Channel #${channelID} already exists!`, toastOptions());
        }

        working = false;
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Channel</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Use channels to split events into easily accessible groups. Visit the <a
            href="/docs"
            target="_blank"
            class="pretty-link">documentation</a>
        for more information.
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Channel ID</span>
                <Input
                    bind:value={channelID}
                    sanitizer={sanitizeProjectIdInput}
                    placeholder="payments" />
                <!-- TODO: space input should auto replace on input -->
            </label>
            <p class="mt-2 max-w-[35ch] px-0.5 leading-5">
                <small class="mt-1">
                    Allowed characters: lowercase letters, numbers, dashes and underscores.
                </small>
            </p>
        </fieldset>
        <!-- TODO: Add notify checkbox -->
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="muted"
                on:click={onCancel}>Cancel</Button>
            <Button on:click={onCreate} loading={working}>Create</Button>
        </div>
    </svelte:fragment>
</Modal>
