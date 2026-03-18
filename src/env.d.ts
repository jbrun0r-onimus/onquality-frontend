/* eslint-disable */
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: import('vite/types/importGlob').ImportGlobFunction;
}
