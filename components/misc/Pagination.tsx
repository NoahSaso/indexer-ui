import {
  ArrowBackRounded,
  ArrowForwardRounded,
  Remove,
} from '@mui/icons-material'
import clsx from 'clsx'

import { Button, IconButton } from '../button'

export const MIN_PAGE = 1

export type PaginationProps = {
  total: number
  page: number
  setPage: (page: number) => void
  pageSize: number
  className?: string
}

export const Pagination = ({
  total,
  page,
  setPage,
  pageSize,
  className,
}: PaginationProps) => {
  const maxPage = Math.ceil(total / pageSize)

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between gap-2',
        className
      )}
    >
      <IconButton
        Icon={ArrowBackRounded}
        disabled={page === MIN_PAGE}
        onClick={() => setPage(page - 1)}
        rounded
        size="sm"
        variant="ghost"
      />

      <Button
        circular
        className="text-lg"
        disabled={page === MIN_PAGE}
        onClick={() => setPage(MIN_PAGE)}
        pressed={page === MIN_PAGE}
        size="sm"
        variant="ghost"
      >
        {MIN_PAGE}
      </Button>

      {/* Show current page if not first or last. */}
      {page > MIN_PAGE && page < maxPage ? (
        <Button className="text-lg" disabled pressed size="sm" variant="ghost">
          {page}
        </Button>
      ) : (
        <Remove className="!h-5 !w-5" />
      )}

      <Button
        circular
        className="text-lg"
        disabled={page === maxPage}
        onClick={() => setPage(maxPage)}
        pressed={page === maxPage}
        size="sm"
        variant="ghost"
      >
        {maxPage}
      </Button>

      <IconButton
        Icon={ArrowForwardRounded}
        disabled={page === maxPage}
        onClick={() => setPage(page + 1)}
        rounded
        size="sm"
        variant="ghost"
      />
    </div>
  )
}
