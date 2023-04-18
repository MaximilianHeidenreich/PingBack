//import adapter from '@sveltejs/adapter-auto';
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/kit/vite";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        preprocess({
            postcss: true
        })
    ],

    kit: {
        adapter: adapter({
            out: "bundled"
        }),
        alias: {
            $cmp: "./src/components",
            $css: "./src/css"
        },
        serviceWorker: {
            register: false
        },
        csrf: { // FIX: Dev only?
            checkOrigin: false,
        }
    },
};

export default config;
