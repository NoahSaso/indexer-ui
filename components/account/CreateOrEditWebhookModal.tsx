import { Add, Close, Edit } from '@mui/icons-material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import {
  Button,
  Checkbox,
  CreateCodeIdSetModal,
  EditCodeIdSetModal,
  FormSwitchCard,
  IconButton,
  InputLabel,
  Loader,
  Modal,
  ModalProps,
  SegmentedControls,
  SelectInput,
  TextAreaInput,
  TextInput,
} from '@/components'
import {
  useCodeIdSets,
  useCreateWebhook,
  useKeys,
  useUpdateWebhook,
  useWebhooks,
} from '@/hooks'
import { AccountWebhookStateKeyType, CreateWebhookRequest } from '@/types'

export type CreateOrEditWebhookModalProps = Omit<ModalProps, 'header'> & {
  onCreate?: Parameters<typeof useCreateWebhook>[0]
  // If defined, modal will be in edit mode.
  editWebhookId?: number
  onEdit?: Parameters<typeof useUpdateWebhook>[0]
}

// Replace arrays of primitives with arrays of objects for form.
type WebhookForm = Omit<
  CreateWebhookRequest,
  'contractAddresses' | 'codeIdSetIds'
> & {
  contractAddresses: {
    address: string
  }[]
  codeIdSetIds: {
    setId: number
  }[]
}

const makeDefaults = () => ({
  description: '',
  url: '',
  onlyFirstSet: false,
  stateKey: '',
  stateKeyType: AccountWebhookStateKeyType.Item,
  contractAddresses: [],
  codeIdSetIds: [],
})

export const CreateOrEditWebhookModal = ({
  onCreate,
  editWebhookId,
  onEdit,
  ...modalProps
}: CreateOrEditWebhookModalProps) => {
  const webhooks = useWebhooks()
  const codeIdSets = useCodeIdSets()
  const keys = useKeys()

  const form = useForm<WebhookForm>({
    defaultValues: makeDefaults(),
  })
  const contractAddresses = useFieldArray({
    control: form.control,
    name: 'contractAddresses',
  })
  const codeIdSetIds = useFieldArray({
    control: form.control,
    name: 'codeIdSetIds',
  })

  const editing = editWebhookId !== undefined
  const editingWebhook = editing
    ? webhooks.data?.find(({ id }) => id === editWebhookId)
    : undefined

  // When editing webhook changes, update form values with defaults.
  useEffect(() => {
    if (!editing || !editingWebhook) {
      return
    }

    form.reset({
      description: editingWebhook.description,
      url: editingWebhook.url,
      onlyFirstSet: editingWebhook.onlyFirstSet,
      stateKey: editingWebhook.stateKey,
      stateKeyType: editingWebhook.stateKeyType,
      contractAddresses: editingWebhook.contractAddresses.map((address) => ({
        address,
      })),
      codeIdSetIds: editingWebhook.codeIdSetIds.map((setId) => ({
        setId,
      })),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, editingWebhook])

  // Reset form defaults when invisible after small delay to let fade out.
  useEffect(() => {
    if (modalProps.visible) {
      return
    }

    const timeout = setTimeout(() => {
      form.reset(makeDefaults())
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProps.visible])

  const createWebhook = useCreateWebhook(onCreate)
  const updateWebhook = useUpdateWebhook(onEdit)

  const [newCodeIdSetVisible, setNewCodeIdSetVisible] = useState(false)
  const [editingCodeIdSetId, setEditingCodeIdSetId] = useState<number>()

  const onSubmit = (data: WebhookForm) => {
    // CreateWebhookRequest is a superset of UpdateWebhookRequest.
    const transformedData: CreateWebhookRequest = {
      ...data,
      accountKeyId: Number(data.accountKeyId),
      contractAddresses: data.contractAddresses.map(({ address }) => address),
      codeIdSetIds: data.codeIdSetIds.map(({ setId }) => setId),
    }

    if (editing) {
      updateWebhook.mutate({
        id: editWebhookId,
        updates: transformedData,
      })
    } else {
      createWebhook.mutate(transformedData)
    }
  }

  return (
    <>
      <Modal
        containerClassName={clsx('w-full', modalProps.containerClassName)}
        header={{
          title: editing ? 'Update webhook' : 'Create webhook',
          subtitle:
            "A webhook will be fired when a contract's state updates. You may filter by contract address, code ID, state key, or any combination of the three. You must apply at least one filter.",
        }}
        {...modalProps}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <InputLabel>Description (optional)</InputLabel>
            <TextAreaInput
              error={form.formState.errors?.description}
              fieldName="description"
              register={form.register}
            />
          </div>

          <div className="space-y-2">
            <InputLabel>URL</InputLabel>
            <TextInput
              error={form.formState.errors?.url}
              fieldName="url"
              register={form.register}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <InputLabel>Contract Addresses</InputLabel>

            <div className="flex flex-col gap-2">
              {contractAddresses.fields.map(({ id }, index) => (
                <div key={id} className="flex flex-row items-center gap-2">
                  <TextInput
                    key={id}
                    className="grow"
                    fieldName={`contractAddresses.${index}.address`}
                    register={form.register}
                    required
                  />

                  <IconButton
                    Icon={Close}
                    onClick={() => contractAddresses.remove(index)}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              ))}
            </div>

            <Button
              className="self-start"
              onClick={() => contractAddresses.append({ address: '' })}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Add className="!h-3 !w-3" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-row items-center justify-between gap-4">
              <InputLabel>Code ID Sets</InputLabel>

              <Button
                onClick={() => setNewCodeIdSetVisible(true)}
                size="sm"
                variant="secondary"
              >
                <Add className="!h-3 !w-3" />
                New Set
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {codeIdSets.isLoading ? (
                <Loader />
              ) : !!codeIdSets.data?.length ? (
                codeIdSets.data.map(({ id, name, codeIds }) => {
                  const indexOfSet = codeIdSetIds.fields.findIndex(
                    (field) => field.setId === id
                  )

                  return (
                    <div
                      key={id}
                      className="flex flex-row items-center justify-between gap-4"
                    >
                      <div
                        className="group flex grow cursor-pointer flex-row items-center gap-2"
                        onClick={() =>
                          indexOfSet > -1
                            ? codeIdSetIds.remove(indexOfSet)
                            : codeIdSetIds.append({ setId: id })
                        }
                      >
                        <Checkbox checked={indexOfSet > -1} />
                        <p className="truncate">
                          {name}{' '}
                          <span className="caption-text">
                            (Code IDs: {codeIds.join(', ')})
                          </span>
                        </p>
                      </div>

                      <IconButton
                        Icon={Edit}
                        onClick={() => setEditingCodeIdSetId(id)}
                        size="sm"
                        variant="ghost"
                      />
                    </div>
                  )
                })
              ) : (
                <p className="caption-text">
                  No code ID sets found. Create one to continue.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <InputLabel>State Key</InputLabel>
            <p className="caption-text !mt-1">
              CosmWasm state keys are either items or maps. Refer to the
              contract code to determine which type of key you want.
            </p>

            <SegmentedControls<AccountWebhookStateKeyType>
              onSelect={(value) => form.setValue('stateKeyType', value)}
              selected={form.watch('stateKeyType')}
              tabs={[
                { label: 'Item', value: AccountWebhookStateKeyType.Item },
                { label: 'Map', value: AccountWebhookStateKeyType.Map },
              ]}
            />

            <TextInput
              error={form.formState.errors?.stateKey}
              fieldName="stateKey"
              placeholder="key"
              register={form.register}
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <FormSwitchCard
              fieldName="onlyFirstSet"
              label="Only first set"
              setValue={form.setValue}
              value={form.watch('onlyFirstSet')}
            />

            <p className="caption-text">
              When only first set is enabled, the webhook will only fire the
              first time a key is set for a given contract. This lets you detect
              when a contract is first instantiated. When disabled, the webhook
              will fire on every state update.
            </p>
          </div>

          <div className="space-y-2">
            <InputLabel>Key</InputLabel>
            <p className="caption-text !mt-1">
              You must choose a key that will be charged when webhooks occur.
            </p>

            <SelectInput
              error={form.formState.errors?.accountKeyId}
              fieldName="accountKeyId"
              register={form.register}
              required
            >
              {keys.data?.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </SelectInput>
          </div>

          <Button
            className="mt-4"
            loading={createWebhook.isLoading}
            size="lg"
            type="submit"
            variant="secondary"
          >
            {editing ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>

      <CreateCodeIdSetModal
        onClose={() => setNewCodeIdSetVisible(false)}
        onCreate={(setId) => {
          // Add to form.
          codeIdSetIds.append({ setId })
          // Hide modal.
          setNewCodeIdSetVisible(false)
        }}
        visible={newCodeIdSetVisible}
      />

      <EditCodeIdSetModal
        codeIdSetId={editingCodeIdSetId ?? -1}
        onClose={() => setEditingCodeIdSetId(undefined)}
        onEdit={() => setEditingCodeIdSetId(undefined)}
        visible={editingCodeIdSetId !== undefined}
      />
    </>
  )
}
