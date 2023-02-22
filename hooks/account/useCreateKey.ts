import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { accountApiKeyForName, accountToken } from '@/state'
import { CreateKeyRequest, CreateKeyResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useCreateKey = () => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))
  const setKeyForName = useSetRecoilState(
    accountApiKeyForName(hexPublicKey ?? '')
  )

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
      // Store API key.
      setKeyForName((prev) => ({
        ...prev,
        [createdKey.name]: apiKey,
      }))

      // Refetch keys.
      queryClient.invalidateQueries(['keys', token])
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
