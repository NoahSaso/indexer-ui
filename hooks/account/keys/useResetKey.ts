import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { ResetKeyResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useResetKey = (
  onSuccess?: (id: number, newKey: string) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const resetKey = async (id: number) => {
    const response = await fetch(API_BASE + `/keys/${id}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    onSuccess: ({ key }, id) => {
      // Refetch keys.
      queryClient.invalidateQueries(['keys', token])

      onSuccess?.(id, key)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
