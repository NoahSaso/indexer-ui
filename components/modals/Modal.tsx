import { Close } from '@mui/icons-material'
import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from '../button'

export type ModalProps = {
  children?: ReactNode
  visible: boolean
  onClose?: () => void
  backdropClassName?: string
  containerClassName?: string
  hideCloseButton?: boolean
  header?: {
    title: string
    subtitle?: string
  }
  headerContent?: ReactNode
  footerContent?: ReactNode
  headerContainerClassName?: string
  contentContainerClassName?: string
  footerContainerClassName?: string
  titleClassName?: string
}

export const Modal = ({
  children,
  visible,
  onClose,
  backdropClassName,
  containerClassName,
  hideCloseButton,
  header,
  headerContent,
  footerContent,
  headerContainerClassName,
  contentContainerClassName,
  footerContainerClassName,
  titleClassName,
}: ModalProps) => {
  // Close modal on escape, only listening if visible.
  useEffect(() => {
    if (!onClose || !visible) {
      return
    }

    const handleKeyPress = (event: KeyboardEvent) =>
      event.key === 'Escape' && onClose()

    // Attach event listener.
    document.addEventListener('keydown', handleKeyPress)
    // Clean up event listener.
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [onClose, visible])

  return typeof document !== 'undefined'
    ? createPortal(
        <div
          className={clsx(
            'fixed top-0 left-0 z-40 flex h-full w-screen items-center justify-center p-4 backdrop-brightness-50 backdrop-filter transition-all duration-[120ms]',
            visible ? 'opacity-100' : 'pointer-events-none opacity-0',
            onClose && 'cursor-pointer',
            backdropClassName
          )}
          onClick={
            onClose &&
            // Only close if click specifically on backdrop.
            (({ target, currentTarget }) =>
              target === currentTarget && onClose())
          }
        >
          <div
            className={clsx(
              'relative flex h-min max-h-[90vh] max-w-md cursor-auto flex-col overflow-x-hidden rounded-lg border border-border-secondary bg-background-base shadow-dp8 transition-transform duration-[120ms]',
              visible ? 'scale-100' : 'scale-90',
              // If no children, remove bottom padding since header has its own
              // padding.
              !children && '!pb-0',
              containerClassName
            )}
          >
            {!hideCloseButton && onClose && (
              <IconButton
                Icon={Close}
                className="absolute top-2 right-2 z-50"
                iconClassName="text-icon-tertiary"
                onClick={onClose}
                rounded
              />
            )}

            {(header || headerContent) && (
              <div
                className={clsx(
                  'flex shrink-0 flex-col gap-1 p-6',
                  // If children, add bottom border.
                  children && 'border-b border-border-base',
                  headerContainerClassName
                )}
              >
                {header && (
                  <>
                    <p
                      className={clsx(
                        'header-text',
                        titleClassName,
                        // If close button displaying, add more right padding.
                        !hideCloseButton && 'pr-12'
                      )}
                    >
                      {header.title}
                    </p>
                    {!!header.subtitle && (
                      <div
                        className={clsx(
                          'mt-1 space-y-1',
                          // If close button displaying, add more right padding.
                          !hideCloseButton && 'pr-12'
                        )}
                      >
                        {header.subtitle.split('\n').map((line, index) => (
                          <p key={index} className="body-text">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {headerContent}
              </div>
            )}

            {children && (
              <div
                className={clsx(
                  'flex grow flex-col overflow-y-auto p-6',
                  contentContainerClassName
                )}
              >
                {children}
              </div>
            )}

            {footerContent && (
              <div
                className={clsx(
                  'shrink-0 border-t border-border-secondary py-5 px-6',
                  footerContainerClassName
                )}
              >
                {footerContent}
              </div>
            )}
          </div>
        </div>,
        document.body
      )
    : null
}
