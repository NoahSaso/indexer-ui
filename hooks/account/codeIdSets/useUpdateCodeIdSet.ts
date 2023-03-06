import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { UpdateCodeIdSetRequest, UpdateCodeIdSetResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useUpdateCodeIdSet = (onSuccess?: () => void) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const updateCodeIdSet = async ({
    id,
    updates,
  }: {
    id: number
    updates: UpdateCodeIdSetRequest
  }) => {
    const response = await fetch(API_BASE + '/code-id-sets/' + id, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    // No content on success.
    if (response.status === 204) {
      return
    }

    const body: UpdateCodeIdSetResponse = await response
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
  return useMutation(updateCodeIdSet, {
    onSuccess: () => {
      // Refetch webhooks.
      queryClient.invalidateQueries(['codeIdSets', token])

      onSuccess?.()
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
