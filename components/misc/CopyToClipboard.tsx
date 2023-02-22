import { Check, CopyAll } from '@mui/icons-material'
import clsx from 'clsx'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '../button'

export type CopyToClipboardProps = {
  value: string
  label?: string
  loading?: boolean
  className?: string
  textClassName?: string
}

export const CopyToClipboard = ({
  value,
  label,
  textClassName,
  className,
}: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false)

  const Icon = copied ? Check : CopyAll

  return (
    <Button
      className={clsx(
        'symbol-small-body-text overflow-hidden !p-4 font-mono',
        className
      )}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setTimeout(() => setCopied(false), 2000)
        setCopied(true)
        toast.success('Copied to clipboard.')
      }}
      variant="secondary"
    >
      <Icon className="!h-5 !w-5 shrink-0" />

      <span
        className={clsx('grow truncate text-left transition', textClassName)}
      >
        {label ?? value}
      </span>
    </Button>
  )
}
