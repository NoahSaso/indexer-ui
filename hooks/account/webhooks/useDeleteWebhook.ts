import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { DeleteWebhookResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useDeleteWebhook = (onSuccess?: () => void) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const deleteWebhook = async (id: number) => {
    const response = await fetch(API_BASE + '/webhooks/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const body: DeleteWebhookResponse = await response.json().catch((err) => ({
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
