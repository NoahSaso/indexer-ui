import clsx from 'clsx'
import { ReactNode } from 'react'

export type TagProps = {
  children: ReactNode
  className?: string
}

export const Tag = ({ children, className }: TagProps) => (
  <span
    className={clsx(
      'my-[2px] inline-block rounded-lg bg-background-button-secondary-default py-[2px] px-[4px]',
      className
    )}
  >
    {children}
  </span>
)
