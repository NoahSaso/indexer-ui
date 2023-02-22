import { useQuery } from 'react-query'

import { GetConfigResponse } from '@/types'
import { API_BASE } from '@/utils'

export const useConfig = () =>
  useQuery('config', async () => {
    const response = await fetch(API_BASE + '/config')

    const body: GetConfigResponse = await response.json().catch((err) => ({
      error: err instanceof Error ? err.message : err,
    }))
    if ('error' in body) {
      throw new Error(body.error)
    }

    return body.config
  })
