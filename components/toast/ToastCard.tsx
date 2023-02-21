import { Close } from '@mui/icons-material'
import clsx from 'clsx'
import { ReactNode, cloneElement } from 'react'
import { Toast, ToastBar, toast as hotToast } from 'react-hot-toast'

import { IconButton } from '../button'
import { Loader } from '../Loader'

type ToastCardProps = {
  toast: Toast
  containerClassName?: string
  preMessage?: ReactNode
}

const ToastCard = ({
  toast,
  containerClassName,
  preMessage,
}: ToastCardProps) => (
  <ToastBar toast={toast}>
    {({ message }) => (
      <div
        className={clsx(
          'caption-text shadow-dp2 flex min-w-0 flex-row items-start gap-4 rounded-lg bg-component-toast p-4 text-sm text-text-component-primary',
          containerClassName
        )}
      >
        {preMessage}

        <div className="min-w-0 grow break-words">
          {!message || typeof message === 'string'
            ? message
            : cloneElement(message, {
                className: '!block !m-0 break-words',
              })}
        </div>

        <IconButton
          Icon={Close}
          className="!text-icon-component-secondary"
          onClick={() => hotToast.dismiss(toast.id)}
          size="sm"
        />
      </div>
    )}
  </ToastBar>
)

export const SuccessToast = (props: ToastCardProps) => <ToastCard {...props} />

export const ErrorToast = (props: ToastCardProps) => (
  <ToastCard containerClassName="!bg-color-error" {...props} />
)

export const LoadingToast = (props: ToastCardProps) => (
  <ToastCard preMessage={<Loader />} {...props} />
)
