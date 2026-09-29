/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTROL_PLANE_URL: string;
  readonly VITE_PROXY_URL: string;
  readonly VITE_ALGORAND_NETWORK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
