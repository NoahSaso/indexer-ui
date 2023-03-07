import clsx from 'clsx'

import { Button } from './Button'
import { DropdownIconButton } from './DropdownIconButton'

export type DropdownLabelProps = {
  label: string
  open: boolean
  toggle: () => void
  className?: string
}

export const DropdownLabel = ({
  label,
  className,
  ...props
}: DropdownLabelProps) => (
  <div className={clsx('flex flex-row items-center gap-1', className)}>
    <DropdownIconButton className="!text-icon-primary" {...props} />

    <Button className="text-text-primary" onClick={props.toggle} variant="none">
      {label}
    </Button>
  </div>
)
