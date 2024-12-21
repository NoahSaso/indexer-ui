import { ChainInfoID } from '@noahsaso/cosmodal'

export const API_BASE = 'https://accounts.indexer.daodao.zone'
export const SIGNATURE_TYPE = 'Indexer Login'

// Juno mainnet
export const CHAIN_ID = ChainInfoID.Juno1
export const CHAIN_RPC = 'https://juno-rpc.kleomedes.network'

// USDC
export const PAY_DENOM =
  'ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034'
export const PAY_DECIMALS = 6
export const PAY_SYMBOL = 'USDC'
export const PAY_IMAGE = '/axlusdc.png'
