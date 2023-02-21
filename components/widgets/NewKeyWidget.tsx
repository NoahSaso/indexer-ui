import { useWallet } from '@noahsaso/cosmodal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSetRecoilState } from 'recoil'

import { useCfWorkerAuthPostRequest } from '@/hooks'
import { accountApiKeyForName, accountKeys } from '@/state'
import { CreateKeyRequest, CreateKeyResponse } from '@/types'
import { formatError } from '@/utils'

import { Button } from '../button'
import { InputLabel, TextAreaInput, TextInput } from '../input'

export const NewKeyWidget = () => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  if (!hexPublicKey) {
    throw new Error('Public key should be defined.')
  }

  const { ready, postRequest } = useCfWorkerAuthPostRequest()
  const setKeys = useSetRecoilState(accountKeys(hexPublicKey))
  const setKeyForName = useSetRecoilState(accountApiKeyForName(hexPublicKey))

  const [creatingKey, setCreatingKey] = useState(false)
  const createKey = async ({ name, description }: CreateKeyRequest) => {
    if (!ready) {
      toast.error('Not ready.')
      return
    }

    setCreatingKey(true)

    try {
      const request: CreateKeyRequest = {
        name: name.trim(),
        description: description?.trim() || null,
      }

      const createResponse = (await postRequest(
        '/keys',
        request
      )) as CreateKeyResponse

      if ('error' in createResponse) {
        throw new Error(createResponse.error)
      }

      setKeyForName((prev) => ({
        ...prev,
        [request.name]: createResponse.apiKey,
      }))
      setKeys((prev) => [...(prev || []), createResponse.createdKey])
    } catch (err) {
      toast.error(formatError(err))
    } finally {
      setCreatingKey(false)
    }
  }

  const { register, handleSubmit } = useForm<CreateKeyRequest>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  return (
    <div className="flex flex-col gap-4 rounded-md bg-background-primary p-6">
      <div className="space-y-2">
        <InputLabel>Name (unique)</InputLabel>
        <TextInput fieldName="name" register={register} required />
      </div>

      <div className="space-y-2">
        <InputLabel>Description (optional)</InputLabel>
        <TextAreaInput fieldName="description" register={register} />
      </div>

      <Button
        disabled={!ready}
        loading={creatingKey}
        onClick={handleSubmit(createKey)}
        size="lg"
        variant="secondary"
      >
        Create key
      </Button>
    </div>
  )
}
