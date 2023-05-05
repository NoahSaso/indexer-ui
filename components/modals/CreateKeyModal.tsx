import { useForm } from 'react-hook-form'

import { useCreateKey } from '@/hooks'
import { AccountKey, CreateKeyRequest } from '@/types'

import { Modal } from './Modal'
import { Button } from '../button'
import { InputLabel, TextAreaInput, TextInput } from '../input'

export type CreateKeyModalProps = {
  visible: boolean
  onClose: () => void
  onCreateKey?: (key: AccountKey, apiKey: string) => void
}

export const CreateKeyModal = ({
  visible,
  onClose,
  onCreateKey,
}: CreateKeyModalProps) => {
  const createKeyForm = useForm<CreateKeyRequest>({
    defaultValues: {
      name: '',
      description: '',
    },
  })
  const createKey = useCreateKey((...args) => {
    onClose()
    onCreateKey?.(...args)
  })

  return (
    <Modal
      containerClassName="w-full"
      header={{
        title: 'Create key',
      }}
      onClose={onClose}
      visible={visible}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={createKeyForm.handleSubmit((data) => createKey.mutate(data))}
      >
        <div className="space-y-2">
          <InputLabel>Name (unique)</InputLabel>
          <TextInput
            error={createKeyForm.formState.errors?.name}
            fieldName="name"
            register={createKeyForm.register}
            required
          />
        </div>

        <div className="space-y-2">
          <InputLabel>Description (optional)</InputLabel>
          <TextAreaInput
            error={createKeyForm.formState.errors?.description}
            fieldName="description"
            register={createKeyForm.register}
          />
        </div>

        <Button
          loading={createKey.isLoading}
          size="lg"
          type="submit"
          variant="secondary"
        >
          Create key
        </Button>
      </form>
    </Modal>
  )
}
