import { atomFamily } from 'recoil'

import { AccountKey } from '@/types'

// All account data is parameterized by the public key of the account, so that
// they show correctly when switching accounts.

export const accountKeys = atomFamily<AccountKey[], string>({
  key: 'accountKeys',
  default: [],
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
