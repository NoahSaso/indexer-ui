import clsx from 'clsx'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { Loader } from '../misc/Loader'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  // Default: 'md'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  pressed?: boolean
  centered?: boolean
  childContainerClassName?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading,
      pressed,
      centered = true,
      childContainerClassName,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) {
    const disabledOrLoading = disabled || loading

    return (
      <button
        className={clsx(
          'relative block rounded-md transition-all',

          // Sizes.
          {
            'button-text-sm py-1 px-2': size === 'sm',
            'link-text py-[6px] px-[10px]': size === 'md',
            'button-text py-[10px] px-[14px]': size === 'lg',
          },

          // Variants.
          variant === 'primary' && {
            // Default.
            'bg-background-button text-text-button-primary hover:bg-background-button-hover active:bg-background-button-pressed':
              !disabledOrLoading,
            // Disabled.
            'bg-background-button-disabled text-text-button-disabled':
              disabledOrLoading,
          },
          variant === 'secondary' && {
            // Default.
            'hover:bg-background-button-secondary-hover active:bg-background-button-secondary-pressed':
              !disabledOrLoading,
            // Default, not pressed.
            'bg-background-button-secondary-default text-icon-primary':
              !disabledOrLoading && !pressed,
            // Disabled, not pressed.
            'bg-background-button-secondary-disabled text-text-interactive-disabled':
              disabledOrLoading && !pressed,
            // Default or disabled, pressed.
            'bg-background-interactive-active text-text-interactive-active':
              pressed,
          },
          variant === 'ghost' && {
            // Default.
            'hover:bg-background-interactive-hover active:bg-background-interactive-pressed':
              !disabledOrLoading,
            // Default, not pressed.
            'bg-transparent text-text-secondary':
              !disabledOrLoading && !pressed,
            // Disabled, not pressed.
            'bg-transparent text-text-interactive-disabled':
              disabledOrLoading && !pressed,
            // Default or disabled, pressed.
            'bg-transparent text-text-brand': disabledOrLoading,
          },
          variant === 'danger' && {
            // Default.
            'bg-background-interactive-error text-text-interactive-error hover:opacity-70 active:opacity-60':
              !disabledOrLoading,
            // Disabled.
            'opacity-50': disabledOrLoading,
          },

          className
        )}
        disabled={disabledOrLoading}
        ref={ref}
        type={type}
        {...props}
      >
        {/* Loader. */}
        {loading && (
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center p-[inherit]">
            <Loader
              invert={variant === 'primary'}
              size={
                size === 'sm'
                  ? 12
                  : size === 'md'
                  ? 16
                  : size === 'lg'
                  ? 20
                  : undefined
              }
            />
          </div>
        )}

        {/* Content. */}
        <div
          className={clsx(
            'relative flex h-full w-full flex-row items-center gap-2',
            centered ? 'justify-center' : 'justify-start',
            loading && 'opacity-0',
            childContainerClassName
          )}
        >
          {children}
        </div>
      </button>
    )
  }
)
