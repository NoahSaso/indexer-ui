import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

export const Link = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof NextLink>
>(function Link({ children, ...props }, ref) {
  const { asPath } = useRouter()
  const isActive = asPath === props.href

  return (
    <NextLink {...props} ref={ref}>
      <p className={clsx(isActive && 'underline')}>{children}</p>
    </NextLink>
  )
})
