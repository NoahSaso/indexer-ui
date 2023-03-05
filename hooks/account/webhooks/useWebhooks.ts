import { useWallet } from '@noahsaso/cosmodal'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { ListWebhooksResponse } from '@/types'
import { API_BASE } from '@/utils'

export const useWebhooks = () => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  return useQuery(['webhooks', token], async () => {
    if (!token) {
      return []
    }

    const response = await fetch(API_BASE + '/webhooks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const body: ListWebhooksResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body.webhooks
  })
}
