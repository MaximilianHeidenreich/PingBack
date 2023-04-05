import { sveltekit } from "@sveltejs/kit/vite";
//import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import path from "path";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

export default defineConfig({
    plugins: [sveltekit()], // SvelteKitPWA()
    define: {
        __VERSION__: JSON.stringify(pkg.version),
		'process.env.NODE_ENV': '"production"',
    },
    /*build: {
        rollupOptions: {
            cache: false,
            maxParallelFileOps: 2,
            output: {
                manualChunks: (id) => {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
                sourcemapIgnoreList: (relativeSourcePath) => {
                    const normalizedPath = path.normalize(relativeSourcePath);
                    return normalizedPath.includes("node_modules");
                },
            },
        }
    }*/
});
