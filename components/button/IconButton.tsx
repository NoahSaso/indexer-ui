import clsx from 'clsx'
import { ComponentPropsWithoutRef, ComponentType, forwardRef } from 'react'

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'ghost'
  // Default: 'md'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  Icon: ComponentType<{ className?: string }>
  iconClassName?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { variant = 'ghost', size = 'md', rounded, Icon, iconClassName, ...props },
    ref
  ) {
    return (
      <button
        className={clsx(
          'flex shrink-0 items-center justify-center transition-all',

          // Rounded.
          rounded ? 'rounded-full' : 'rounded-md',

          // Sizes.
          {
            'p-1': size === 'sm',
            'p-2': size === 'md',
            'p-3': size === 'lg',
          },

          // Variants.
          variant === 'ghost' && {
            // Default
            'bg-transparent text-icon-secondary hover:bg-background-interactive-hover active:bg-background-interactive-pressed':
              !props.disabled,
            // Disabled
            'text-icon-interactive-disabled': props.disabled,
          },

          props.className
        )}
        ref={ref}
        {...props}
      >
        <Icon
          className={clsx(
            // Sizes.
            {
              '!h-4 !w-4': size === 'sm',
              '!h-6 !w-6': size === 'md',
              '!h-8 !w-8': size === 'lg',
            },
            iconClassName
          )}
        />
      </button>
    )
  }
)
