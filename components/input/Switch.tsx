import clsx from 'clsx'
import { FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form'

// Return the field name paths that have type boolean.
type BooleanFieldNames<FV extends FieldValues> = {
  [Property in Path<FV>]: PathValue<FV, Property> extends boolean | undefined
    ? Property
    : never
}[Path<FV>]

export type SwitchProps = {
  enabled: boolean
  onClick: () => void
  className?: string
  sizing?: 'sm' | 'lg'
}

export const Switch = ({
  enabled,
  onClick,
  className,
  sizing = 'lg',
}: SwitchProps) => (
  <div
    className={clsx(
      'relative flex flex-none cursor-pointer items-center rounded-full hover:opacity-90',
      {
        'bg-background-button-active': enabled,
        'border border-border-interactive-focus bg-transparent': !enabled,
        // Sizing.
        'h-[16px] w-[28px]': sizing === 'sm',
        'h-[38px] w-[67px]': sizing === 'lg',
      },
      className
    )}
    onClick={onClick}
  >
    <div
      className={clsx(
        'absolute rounded-full bg-background-button transition-all',
        // Sizing.
        {
          // Small
          'h-[10px] w-[10px]': sizing === 'sm',
          'left-[15px]': sizing === 'sm' && enabled,
          'left-[2px]': sizing === 'sm' && !enabled,
          // Large
          'h-[28px] w-[28px]': sizing === 'lg',
          'left-[33px]': sizing === 'lg' && enabled,
          'left-[4.5px]': sizing === 'lg' && !enabled,
        }
      )}
    ></div>
  </div>
)

export type SwitchCardProps = SwitchProps & {
  containerClassName?: string
  // Fallback for both on and off. Use if label should not change.
  label?: string
  onLabel?: string
  offLabel?: string
}

export const SwitchCard = ({
  containerClassName,
  label,
  onLabel: _onLabel,
  offLabel: _offLabel,
  ...props
}: SwitchCardProps) => {
  const onLabel = _onLabel ?? label ?? 'Enabled'
  const offLabel = _offLabel ?? label ?? 'Disabled'

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between gap-4 rounded-md bg-background-secondary py-2 px-3',
        containerClassName
      )}
    >
      <p className="secondary-text min-w-[5rem]">
        {props.enabled ? onLabel : offLabel}
      </p>

      <Switch {...props} />
    </div>
  )
}

export type FormSwitchWrapperProps<
  Props,
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
> = Omit<Props, 'enabled' | 'onClick'> & {
  fieldName: BooleanFieldName
  value: boolean | undefined
  setValue: UseFormSetValue<FV>
  onToggle?: (newValue: boolean) => void
}

export const FormSwitch = <
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
>({
  fieldName,
  value,
  setValue,
  onToggle,
  ...props
}: FormSwitchWrapperProps<SwitchProps, FV, BooleanFieldName>) => (
  <Switch
    enabled={!!value}
    onClick={() => {
      const newValue = !value
      setValue(fieldName, newValue as any)
      onToggle?.(newValue)
    }}
    {...props}
  />
)

export const FormSwitchCard = <
  FV extends FieldValues,
  BooleanFieldName extends BooleanFieldNames<FV>
>({
  fieldName,
  value,
  setValue,
  onToggle,
  ...props
}: FormSwitchWrapperProps<SwitchCardProps, FV, BooleanFieldName>) => (
  <SwitchCard
    enabled={!!value}
    onClick={() => {
      const newValue = !value
      setValue(fieldName, newValue as any)
      onToggle?.(newValue)
    }}
    sizing="sm"
    {...props}
  />
)
