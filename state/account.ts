import { atom, atomFamily } from 'recoil'

import { localStorageEffectJSON } from './effects'

// Parameter is the hex public key.
export const accountToken = atomFamily<string, string>({
  key: 'accountToken',
  default: '',
  effects: [localStorageEffectJSON],
})

export const loggingInAtom = atom<boolean>({
  key: 'loggingIn',
  default: false,
})
