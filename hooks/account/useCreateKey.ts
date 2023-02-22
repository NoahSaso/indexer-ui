import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { AccountKey, CreateKeyRequest, CreateKeyResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useCreateKey = (
  onSuccess?: (key: AccountKey, apiKey: string) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const createKey = async (request: CreateKeyRequest) => {
    const response = await fetch(API_BASE + '/keys', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const body: CreateKeyResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body
  }

  const queryClient = useQueryClient()
  return useMutation(createKey, {
    onSuccess: ({ apiKey, createdKey }) => {
      // Refetch keys.
      queryClient.invalidateQueries(['keys', token])

      onSuccess?.(createdKey, apiKey)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
