import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { selector } from 'recoil'

import { CHAIN_RPC } from '@/utils'

export const cosmWasmClient = selector({
  key: 'cosmWasmClient',
  get: () => CosmWasmClient.connect(CHAIN_RPC),
})
