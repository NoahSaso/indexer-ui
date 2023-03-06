import { Add, Close } from '@mui/icons-material'
import { useEffect } from 'react'
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
import { useCodeIdSets, useUpdateCodeIdSet } from '@/hooks'
import { UpdateCodeIdSetRequest } from '@/types'

export type EditCodeIdSetModalProps = Omit<ModalProps, 'header'> & {
  codeIdSetId: number
  onEdit: Parameters<typeof useUpdateCodeIdSet>[0]
}

// Replace arrays of primitives with arrays of objects for form.
type EditCodeIdSetForm = Omit<UpdateCodeIdSetRequest, 'codeIds'> & {
  codeIds: {
    codeId: number
  }[]
}

export const EditCodeIdSetModal = ({
  codeIdSetId,
  onEdit,
  ...modalProps
}: EditCodeIdSetModalProps) => {
  const codeIdSets = useCodeIdSets()
  const codeIdSet = codeIdSets.data?.find(({ id }) => id === codeIdSetId)

  const editCodeIdSetForm = useForm<EditCodeIdSetForm>({
    defaultValues: {
      name: codeIdSet?.name ?? '',
      codeIds: (codeIdSet?.codeIds ?? []).map((codeId) => ({ codeId })),
    },
  })
  const {
    fields: codeIdFields,
    append: appendCodeId,
    remove: removeCodeId,
  } = useFieldArray({
    control: editCodeIdSetForm.control,
    name: 'codeIds',
  })

  // When code ID set changes, update form values with defaults.
  useEffect(() => {
    editCodeIdSetForm.reset({
      name: codeIdSet?.name ?? '',
      codeIds: (codeIdSet?.codeIds ?? []).map((codeId) => ({ codeId })),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeIdSet])

  const updateCodeIdSet = useUpdateCodeIdSet(onEdit)
  const onSubmit = (data: EditCodeIdSetForm) => {
    if (data.codeIds.length === 0) {
      toast.error('Must have at least one code ID.')
      return
    }

    updateCodeIdSet.mutate({
      id: codeIdSetId,
      updates: {
        ...data,
        codeIds: data.codeIds.map(({ codeId }) => codeId),
      },
    })
  }

  return (
    <Modal
      header={{
        title: 'Edit code ID set',
      }}
      {...modalProps}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={editCodeIdSetForm.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <InputLabel>Name</InputLabel>
          <TextInput
            error={editCodeIdSetForm.formState.errors?.name}
            fieldName="name"
            register={editCodeIdSetForm.register}
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
                  register={editCodeIdSetForm.register}
                  required
                  setValue={editCodeIdSetForm.setValue}
                  watch={editCodeIdSetForm.watch}
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
          loading={updateCodeIdSet.isLoading}
          size="lg"
          type="submit"
          variant="secondary"
        >
          Save
        </Button>
      </form>
    </Modal>
  )
}
