import { atomFamily } from 'recoil'

import { localStorageEffectJSON } from './effects'

// All account data is parameterized by the public key of the account, so that
// they show correctly when switching accounts.

export const accountToken = atomFamily<string, string>({
  key: 'accountToken',
  default: '',
  effects: [localStorageEffectJSON],
})

// Map from key name to its API key. This is only returned by the create or
// reset key response, so cache it to display to the user.
export const accountApiKeyForName = atomFamily<
  Partial<Record<string, string>>,
  string
>({
  key: 'accountApiKeyForName',
  default: {},
})
