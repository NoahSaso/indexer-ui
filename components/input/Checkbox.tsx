import { Check } from '@mui/icons-material'
import clsx from 'clsx'

export type CheckboxProps = {
  checked: boolean
  onClick?: () => void
  className?: string
  size?: 'sm' | 'default'
}

export const Checkbox = ({
  checked,
  onClick,
  className,
  size = 'default',
}: CheckboxProps) => (
  <div
    className={clsx(
      'group inline-flex cursor-pointer items-center justify-center rounded outline outline-1 outline-border-primary transition-all hover:bg-background-button-hover active:bg-background-button-pressed active:outline-2 group-hover:bg-background-button-hover group-active:bg-background-button-pressed group-active:outline-2',
      checked ? 'bg-component-pill' : 'bg-background-button',
      className
    )}
    onClick={onClick}
  >
    <Check
      className={clsx(
        'text-icon-primary transition-all group-hover:text-icon-button-primary',
        checked ? 'opacity-100' : 'opacity-0',
        {
          '!h-4 !w-4': size === 'sm',
          '!h-5 !w-5': size === 'default',
        }
      )}
    />
  </div>
)
