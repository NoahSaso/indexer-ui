import { Add, Close } from '@mui/icons-material'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import {
  Button,
  IconButton,
  InputLabel,
  Modal,
  ModalProps,
  NumberInput,
  TextInput,
} from '@/components'
import { useCreateCodeIdSet } from '@/hooks'
import { CreateCodeIdSetRequest } from '@/types'

export type CreateCodeIdSetModalProps = Omit<ModalProps, 'header'> & {
  onCreate: Parameters<typeof useCreateCodeIdSet>[0]
}

// Replace arrays of primitives with arrays of objects for form.
type CreateCodeIdSetForm = Omit<CreateCodeIdSetRequest, 'codeIds'> & {
  codeIds: {
    codeId: number
  }[]
}

export const CreateCodeIdSetModal = ({
  onCreate,
  ...modalProps
}: CreateCodeIdSetModalProps) => {
  const createCodeIdSetForm = useForm<CreateCodeIdSetForm>({
    defaultValues: {
      name: '',
      codeIds: [
        {
          codeId: 0,
        },
      ],
    },
  })
  const {
    fields: codeIdFields,
    append: appendCodeId,
    remove: removeCodeId,
  } = useFieldArray({
    control: createCodeIdSetForm.control,
    name: 'codeIds',
  })

  const createCodeIdSet = useCreateCodeIdSet(onCreate)
  const onSubmit = (data: CreateCodeIdSetForm) => {
    if (data.codeIds.length === 0) {
      toast.error('Must have at least one code ID.')
      return
    }

    createCodeIdSet.mutate({
      ...data,
      codeIds: data.codeIds.map(({ codeId }) => codeId),
    })
  }

  return (
    <Modal
      header={{
        title: 'Create code ID set',
        subtitle:
          'A code ID set represents a group of code IDs that refer to a common contract. Each code ID likely corresponds to a different version of the contract.',
      }}
      {...modalProps}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={createCodeIdSetForm.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <InputLabel>Name</InputLabel>
          <TextInput
            error={createCodeIdSetForm.formState.errors?.name}
            fieldName="name"
            register={createCodeIdSetForm.register}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <InputLabel>Code IDs</InputLabel>

          <div className="flex flex-col gap-2">
            {codeIdFields.map(({ id }, index) => (
              <div key={id} className="flex flex-row items-center gap-2">
                <NumberInput
                  key={id}
                  containerClassName="grow"
                  fieldName={`codeIds.${index}.codeId`}
                  register={createCodeIdSetForm.register}
                  required
                  setValue={createCodeIdSetForm.setValue}
                  watch={createCodeIdSetForm.watch}
                />

                <IconButton
                  Icon={Close}
                  onClick={() => removeCodeId(index)}
                  size="sm"
                  variant="ghost"
                />
              </div>
            ))}
          </div>

          <Button
            className="self-start"
            onClick={() => appendCodeId({ codeId: 0 })}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Add className="!h-3 !w-3" />
            Add
          </Button>
        </div>

        <Button
          className="mt-4"
          loading={createCodeIdSet.isLoading}
          size="lg"
          type="submit"
          variant="secondary"
        >
          Create
        </Button>
      </form>
    </Modal>
  )
}
