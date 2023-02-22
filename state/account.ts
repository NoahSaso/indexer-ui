import { atomFamily } from 'recoil'

import { localStorageEffectJSON } from './effects'

// Parameter is the hex public key.
export const accountToken = atomFamily<string, string>({
  key: 'accountToken',
  default: '',
  effects: [localStorageEffectJSON],
})
