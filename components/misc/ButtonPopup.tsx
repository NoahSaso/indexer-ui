import clsx from 'clsx'
import { ComponentType, Dispatch, SetStateAction, useRef } from 'react'

import { Popup, PopupProps } from './Popup'
import { Button, ButtonProps } from '../button'

export type ButtonPopupSection = {
  label?: string
  buttons: (ButtonProps & {
    Icon?: ComponentType<{ className?: string }>
    label: string
  })[]
}

export type ButtonPopupProps = Omit<PopupProps, 'children' | 'setOpenRef'> & {
  sections: ButtonPopupSection[]
  // If true, clicking on a button will not close the popup.
  dontCloseOnClick?: boolean
}

export const ButtonPopup = ({
  sections,
  dontCloseOnClick = false,
  ...props
}: ButtonPopupProps) => {
  const setOpenRef = useRef<Dispatch<SetStateAction<boolean>> | null>(null)

  return (
    <Popup {...props} setOpenRef={setOpenRef}>
      {sections.map(({ label, buttons }, index) => (
        <div
          key={index}
          className={clsx(
            'flex flex-col gap-2 py-3 px-4',
            index > 0 && 'border-t border-border-secondary'
          )}
        >
          {label && <p className="link-text text-text-secondary">{label}</p>}

          {buttons.map(
            (
              { Icon, label, onClick, variant = 'secondary', ...buttonProps },
              index
            ) => (
              <Button
                key={index}
                onClick={(event) => {
                  onClick?.(event)
                  // Close on click.
                  if (!dontCloseOnClick) {
                    setOpenRef.current?.(false)
                  }
                }}
                variant={variant}
                {...buttonProps}
              >
                {Icon && (
                  <div className="flex h-6 w-6 items-center justify-center text-lg ">
                    <Icon className="h-5 w-5 text-icon-primary" />
                  </div>
                )}
                {label}
              </Button>
            )
          )}
        </div>
      ))}
    </Popup>
  )
}
