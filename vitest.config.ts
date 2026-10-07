import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// the packages by name, from their sources, as Node finds them with --conditions=source
const packages = fileURLToPath(new URL("./packages/", import.meta.url));

export default defineConfig({
	resolve: {
		alias: [{ find: /^@mrq\/(vt420(?:-emu)?)\/(.+)\.js$/, replacement: `${packages}$1/src/$2.ts` }],
	},
});
