import clsx from 'clsx'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

export const InputLabel = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<'p'>
>(function InputLabel({ children, className, ...props }, ref) {
  return (
    <p className={clsx('secondary-text', className)} {...props} ref={ref}>
      {children}
    </p>
  )
})
