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

export type TextAreaInputProps<
  FV extends FieldValues,
  FieldName extends Path<FV>
> = ComponentPropsWithoutRef<'textarea'> & {
  fieldName: FieldName
  register: UseFormRegister<FV>
  validations?: Validate<FieldPathValue<FV, FieldName>, FV>[]
  error?: FieldError
}

export const TextAreaInput = <
  FV extends FieldValues,
  FieldName extends Path<FV>
>({
  fieldName,
  register,
  error,
  validations,
  className,
  required,
  ...props
}: TextAreaInputProps<FV, FieldName>) => {
  const validate = validations?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  return (
    <textarea
      className={clsx(
        'secondary-text w-full appearance-none rounded-md bg-transparent py-3 px-4 text-text-body ring-1 transition placeholder:text-text-tertiary focus:outline-none focus:ring-2',
        error
          ? 'ring-border-interactive-error'
          : 'ring-border-primary focus:ring-border-interactive-focus',
        className
      )}
      {...props}
      {...register(fieldName, { required: required && 'Required', validate })}
    ></textarea>
  )
}
