import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { ResetKeyRequest, ResetKeyResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useResetKey = (
  onSuccess?: (name: string, newKey: string) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const resetKey = async (request: ResetKeyRequest) => {
    const response = await fetch(API_BASE + '/keys/reset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const body: ResetKeyResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body
  }

  const queryClient = useQueryClient()
  return useMutation(resetKey, {
    onSuccess: ({ key }, { name }) => {
      // Refetch keys.
      queryClient.invalidateQueries(['keys', token])

      onSuccess?.(name, key)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
