/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly DEV: boolean;
	readonly MODE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}