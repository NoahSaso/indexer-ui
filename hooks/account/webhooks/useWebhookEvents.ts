import { useWallet } from '@noahsaso/cosmodal'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { GetWebhookEventsResponse } from '@/types'
import { API_BASE } from '@/utils'

type UseWebhookEventsOptions = {
  enabled?: boolean
}

export const useWebhookEvents = (
  webhookId: number,
  options?: UseWebhookEventsOptions
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  return useQuery(
    ['webhookEvents', token, webhookId],
    async () => {
      if (!token) {
        return []
      }

      const response = await fetch(API_BASE + `/webhooks/${webhookId}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const body: GetWebhookEventsResponse = await response
        .json()
        .catch((err) => ({
          error: err instanceof Error ? err.message : err,
        }))
      if ('error' in body) {
        throw new Error(body.error)
      }

      return body.events
    },
    options
  )
}
