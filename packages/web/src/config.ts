// Config — read from Vite env vars
export const CONTROL_PLANE_URL =
  import.meta.env.VITE_CONTROL_PLANE_URL || 'https://modu-to68.onrender.com';

export const PROXY_URL =
  import.meta.env.VITE_PROXY_URL || 'https://modu-proxy.onrender.com';

export const ALGORAND_NETWORK =
  import.meta.env.VITE_ALGORAND_NETWORK || 'testnet';

export const ALGORAND_EXPLORER =
  ALGORAND_NETWORK === 'mainnet'
    ? 'https://allo.info/tx'
    : 'https://testnet.explorer.perawallet.app/tx';

export const ALGORAND_DISPENSER = 'https://testnet.algoexplorer.io/dispenser';

export const ALGORAND_TESTNET_USDC_ASA_ID = '10458941';
export const ALGORAND_MAINNET_USDC_ASA_ID = '31566704';

export const GITHUB_URL = 'https://github.com/rupamghosh2006/modu';
