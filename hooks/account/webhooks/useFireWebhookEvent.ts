import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { AccountWebhookEventAttempt, FireWebhookEventResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useFireWebhookEvent = (
  onSuccess?: (attempt: AccountWebhookEventAttempt) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const fireWebhookEvent = async ({
    id,
    uuid,
  }: {
    id: number
    uuid: string
  }) => {
    const response = await fetch(
      API_BASE + `/webhooks/${id}/events/${uuid}/fire`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const body: FireWebhookEventResponse = await response
      .json()
      .catch((err) => ({
        error: err instanceof Error ? err.message : err,
      }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body.attempt
  }

  const queryClient = useQueryClient()
  return useMutation(fireWebhookEvent, {
    onSuccess: (attempt, { id }) => {
      // Refetch webhook events to update status and attempts.
      queryClient.invalidateQueries(['webhookEvents', token, id])

      onSuccess?.(attempt)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
