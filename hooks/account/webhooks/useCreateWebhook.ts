import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { CreateWebhookRequest, CreateWebhookResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useCreateWebhook = (
  onSuccess?: (request: CreateWebhookRequest) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const createWebhook = async (request: CreateWebhookRequest) => {
    const response = await fetch(API_BASE + '/webhooks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    // No content on successful creation.
    if (response.status === 201) {
      return
    }

    const body: CreateWebhookResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if (body && 'error' in body) {
      throw new Error(body.error)
    }

    return body
  }

  const queryClient = useQueryClient()
  return useMutation(createWebhook, {
    onSuccess: (_, request) => {
      // Refetch webhooks.
      queryClient.invalidateQueries(['webhooks', token])

      onSuccess?.(request)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
