// eslint-disable-next-line no-shadow
enum BlockChainNames {
  Electrum = "Electrum",
  Esplora = "Esplora",
  Rpc = "Rpc",
}
module "@env" {
  export const DEV: string;
  export const NETWORK: BitcoinNetwork;
  export const API_URL: string;
  export const BLOCKEXPLORER: string;
  export const BLOCKEXPLORER_LIQUID: string;
  export const ESPLORA_URL: string;
  export const ESPLORA_LIQUID_URL: string;
  export const NODE_TYPE: BlockChainNames;
  export const BOLTZ_API: string;
  export const BREEZ_API_KEY: string;
}
