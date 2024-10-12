import { terser } from "rollup-plugin-terser";

export default {
	input: "./src/index.js",
	output: [
		{
			file: "dist/esm.js",
			format: "esm",
		},
		{
			file: "dist/cjs.cjs",
			format: "cjs",
		},
		{
			file: "dist/browser.js",
			format: "iife",
			name: "cursoreffects",
		},
		{
			file: 'dist/turtle-cursor-effects.umd.js',
			format: 'umd',
			name: 'CursorEffects',
		},
	],
	plugins: [terser()],
};
