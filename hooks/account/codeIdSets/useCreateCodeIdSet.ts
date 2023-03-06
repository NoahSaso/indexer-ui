import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { CreateCodeIdSetRequest, CreateCodeIdSetResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useCreateCodeIdSet = (
  onSuccess?: (id: number, request: CreateCodeIdSetRequest) => void
) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const createCodeIdSet = async (request: CreateCodeIdSetRequest) => {
    const response = await fetch(API_BASE + '/code-id-sets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const body: CreateCodeIdSetResponse = await response
      .json()
      .catch((err) => ({
        error: err instanceof Error ? err.message : err,
      }))
    if (body && 'error' in body) {
      throw new Error(body.error)
    }

    return body
  }

  const queryClient = useQueryClient()
  return useMutation(createCodeIdSet, {
    onSuccess: ({ id }, request) => {
      // Refetch code ID sets.
      queryClient.invalidateQueries(['codeIdSets', token])

      onSuccess?.(id, request)
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
