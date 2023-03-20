<script lang="ts">
    import { TKN_ICON } from "$lib/utils/tokens";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    // PROPS
    export let observerRoot: HTMLElement,
        loading: boolean,
        endOfData: boolean,
        processing: boolean,
        processingProgress: [number, number];

    // STATE
    const dispatch = createEventDispatcher();
    let triggerEl: HTMLDivElement;
    let observer: IntersectionObserver;
    let intersecting = false;
    let timer: NodeJS.Timer | undefined;

    // HANDLERS
    $: intersecting: {
        if (intersecting && !loading && !processing && !endOfData) {
            timer = setInterval(handleIntersect, 100);
        } else {
            timer && clearInterval(timer);
        }
    }

    function handleIntersect() {
        console.log("InfiniteEventListTrigger intersected -> Dispatching loadPast");
        dispatch("loadPast", {});
    }

    // HOOKS
    onMount(() => {
        observer = new IntersectionObserver(
            (entries) => {
                const target = entries.find((e) => e.target === triggerEl);
                if (!target) return;
                if (target.isIntersecting) {
                    intersecting = true;
                } else {
                    intersecting = false;
                }
            },
            { root: observerRoot, threshold: 0 } // TOOD: if not rootMargin -> make absolute at end to fetch eralier for UX
        );
        observer.observe(triggerEl);
    });
    onDestroy(() => {
        observer && observer.disconnect();
    });
</script>

<div
    bind:this={triggerEl}
    class="mt-6 mb-36 flex w-full flex-col items-center justify-center gap-2">
    <span class="opacity-0">trigger ;)</span>
    {#if endOfData}
        <span class="text-sm text-neutral-500">No more events!</span>
    {/if}

    {#if loading && !processing}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TKN_ICON.SIZE.SM}
            height={TKN_ICON.SIZE.SM}
            viewBox="0 0 24 24"
            ><style>
                .spinner_ajPY {
                    transform-origin: center;
                    animation: spinner_AtaB 0.75s infinite linear;
                }
                @keyframes spinner_AtaB {
                    100% {
                        transform: rotate(360deg);
                    }
                }
            </style><path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25" /><path
                d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                class="spinner_ajPY" /></svg>
        <span class="text-sm text-neutral-500">Loading events ...</span>
    {/if}

    {#if processing}
        <div class="jelly" />
        <svg
            width="0"
            height="0"
            class="jelly-maker">
            <defs>
                <filter id="uib-jelly-ooze">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="6.25"
                        result="blur" />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="ooze" />
                    <feBlend
                        in="SourceGraphic"
                        in2="ooze" />
                </filter>
            </defs>
        </svg>
        <span class="text-sm text-neutral-500"
            >Processing events (<span class="font-mono"
                >{processingProgress[0]}/{processingProgress[1]}</span
            >) ...</span>
    {/if}
</div>

<style lang="postcss">
    .jelly {
        --uib-size: 24px;
        --uib-speed: 0.8s;
        --uib-color: black;

        position: relative;
        height: calc(var(--uib-size) / 2);
        width: var(--uib-size);
        filter: url("#uib-jelly-ooze");
        animation: rotate calc(var(--uib-speed) * 2) linear infinite;
    }

    .jelly::before,
    .jelly::after {
        content: "";
        position: absolute;
        top: 0%;
        left: 25%;
        width: 50%;
        height: 100%;
        background: var(--uib-color);
        border-radius: 100%;
    }

    .jelly::before {
        animation: shift-left var(--uib-speed) ease infinite;
    }

    .jelly::after {
        animation: shift-right var(--uib-speed) ease infinite;
    }

    .jelly-maker {
        width: 0;
        height: 0;
        position: absolute;
    }

    @keyframes rotate {
        0%,
        49.999%,
        100% {
            transform: none;
        }

        50%,
        99.999% {
            transform: rotate(90deg);
        }
    }

    @keyframes shift-left {
        0%,
        100% {
            transform: translateX(0%);
        }
        50% {
            transform: scale(0.65) translateX(-75%);
        }
    }

    @keyframes shift-right {
        0%,
        100% {
            transform: translateX(0%);
        }
        50% {
            transform: scale(0.65) translateX(75%);
        }
    }
</style>
