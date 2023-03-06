import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

import { accountToken } from '@/state'
import { DeleteCodeIdSetResponse } from '@/types'
import { API_BASE, formatError } from '@/utils'

export const useDeleteCodeIdSet = (onSuccess?: () => void) => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  const token = useRecoilValue(accountToken(hexPublicKey ?? ''))

  const deleteCodeIdSet = async (id: number) => {
    const response = await fetch(API_BASE + '/code-id-sets/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // No content on success.
    if (response.status === 204) {
      return
    }

    const body: DeleteCodeIdSetResponse = await response
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
  return useMutation(deleteCodeIdSet, {
    onSuccess: () => {
      // Refetch code ID sets.
      queryClient.invalidateQueries(['codeIdSets', token])

      onSuccess?.()
    },
    onError: (err) => {
      toast.error(formatError(err))
    },
  })
}
