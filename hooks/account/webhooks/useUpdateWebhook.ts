import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { UpdateWebhookRequest, UpdateWebhookResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useUpdateWebhook = (onSuccess?: () => void) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const deleteWebhook = async ({
    id,
    updates,
  }: {
    id: number
    updates: UpdateWebhookRequest
  }) => {
    const response = await fetch(API_BASE + '/webhooks/' + id, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    const body: UpdateWebhookResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if (body && 'error' in body) {
      throw new Error(body.error)
    }

    return body
  }

  const queryClient = useQueryClient()
  return useMutation(deleteWebhook, {
    onSuccess: () => {
      // Refetch webhooks.
      queryClient.invalidateQueries(['webhooks', token])

      onSuccess?.()
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
