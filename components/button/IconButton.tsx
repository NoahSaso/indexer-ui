import clsx from 'clsx'
import { ComponentPropsWithoutRef, ComponentType, forwardRef } from 'react'

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'ghost'
  // Default: 'md'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  focused?: boolean
  Icon: ComponentType<{ className?: string }>
  iconClassName?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = 'ghost',
      size = 'md',
      rounded,
      focused,
      Icon,
      iconClassName,
      className,
      type = 'button',
      ...props
    },
    ref
  ) {
    return (
      <button
        className={clsx(
          'flex shrink-0 items-center justify-center p-1 transition-all',

          // Rounded.
          rounded ? 'rounded-full' : 'rounded-md',

          // Focused.
          focused && 'ring-2 ring-inset ring-border-interactive-focus',

          // Variants.
          variant === 'ghost' && {
            // Default
            'bg-transparent text-icon-secondary hover:bg-background-interactive-hover active:bg-background-interactive-pressed':
              !props.disabled,
            // Disabled
            'text-icon-interactive-disabled': props.disabled,
          },

          className
        )}
        ref={ref}
        type={type}
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
