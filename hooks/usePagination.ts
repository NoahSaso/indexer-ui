import { useState } from 'react'

import { MIN_PAGE, PaginationProps } from '@/components'

export type UsePaginationOptions<T extends unknown> = {
  data: T[]
  pageSize: number
}

export type UsePaginationResult<T extends unknown> = {
  pagedData: T[]
  paginationProps: PaginationProps
}

export const usePagination = <T extends unknown>({
  data,
  pageSize,
}: UsePaginationOptions<T>): UsePaginationResult<T> => {
  const [page, setPage] = useState(MIN_PAGE)

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagedData = data.slice(start, end)

  return {
    pagedData,
    paginationProps: {
      total: data.length,
      page,
      setPage,
      pageSize,
    },
  }
}
