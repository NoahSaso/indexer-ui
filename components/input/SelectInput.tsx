import { ArrowDropDown } from '@mui/icons-material'
import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import {
  FieldError,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegister,
  Validate,
} from 'react-hook-form'

export type SelectInputProps<
  FV extends FieldValues,
  FieldName extends Path<FV>
> = Omit<ComponentPropsWithoutRef<'select'>, 'onChange'> & {
  fieldName?: FieldName
  register?: UseFormRegister<FV>
  validations?: Validate<FieldPathValue<FV, FieldName>, FV>[]
  error?: FieldError
  onChange?: (value: string) => void
  containerClassName?: string
  iconClassName?: string
}

export const SelectInput = <
  FV extends FieldValues,
  FieldName extends Path<FV>
>({
  fieldName,
  register,
  error,
  validations,
  children,
  required,
  className,
  onChange,
  containerClassName,
  iconClassName,
  disabled,
  ...props
}: SelectInputProps<FV, FieldName>) => {
  const validate = validations?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  return (
    <div className={clsx('relative', containerClassName)}>
      <select
        className={clsx(
          'secondary-text h-full w-full appearance-none truncate rounded-md bg-transparent py-3 pl-4 text-text-body !outline-none ring-1 transition placeholder:text-text-tertiary focus:ring-2',
          error
            ? 'ring-border-interactive-error'
            : 'ring-border-primary focus:ring-border-interactive-focus',
          disabled
            ? 'pointer-events-none pr-4'
            : 'cursor-pointer pr-10 hover:bg-background-interactive-hover active:bg-background-interactive-pressed',
          className
        )}
        disabled={disabled}
        {...props}
        {...(register && fieldName
          ? register(fieldName, {
              required: required && 'Required',
              validate,
              ...(onChange && {
                onChange: (e: any) => onChange(e.target.value),
              }),
            })
          : {
              required,
              onChange: onChange && ((e: any) => onChange(e.target.value)),
            })}
      >
        {children}
      </select>

      {!disabled && (
        <div className="pointer-events-none absolute top-0 bottom-0 right-2 flex flex-row items-center">
          <ArrowDropDown className={clsx('!h-5 !w-5', iconClassName)} />
        </div>
      )}
    </div>
  )
}
