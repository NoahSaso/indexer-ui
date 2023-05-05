import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

export type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  // If true, will underline when active and not underline when inactive. If
  // false, will underline when inactive.
  invert?: boolean
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, className, invert = false, ...props },
  ref
) {
  const { asPath } = useRouter()
  const isActive = asPath === props.href

  return (
    <NextLink
      {...props}
      className={clsx(
        'transition-opacity hover:opacity-80 active:opacity-70',
        isActive === invert && 'underline',
        className
      )}
      ref={ref}
    >
      {children}
    </NextLink>
  )
})
