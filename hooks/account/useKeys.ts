import { useWallet } from '@noahsaso/cosmodal'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { ListKeysResponse } from '@/types'
import { API_BASE } from '@/utils'

export const useKeys = () => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  return useQuery(['keys', token], async () => {
    if (!token) {
      return []
    }

    const response = await fetch(API_BASE + '/keys', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const body: ListKeysResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body.keys
  })
}
