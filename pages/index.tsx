import { SensorsOff } from '@mui/icons-material'
import { useWalletManager } from '@noahsaso/cosmodal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useCfWorkerAuthPostRequest } from '@dao-dao/stateful/hooks/useCfWorkerAuthPostRequest'
import { InputLabel, TextAreaInput, TextInput } from '@dao-dao/stateless'
import { Button } from '@dao-dao/stateless/components/buttons/Button'

import {
  AccountKey,
  CreateKeyRequest,
  CreateKeyResponse,
  ListKeysResponse,
  ResetKeyRequest,
  ResetKeyResponse,
} from '@/types'

import { Connect } from '../components/Connect'

const Home = () => {
  const { connected, disconnect } = useWalletManager()

  const { ready, postRequest } = useCfWorkerAuthPostRequest(
    'https://accounts.indexer.zone',
    'Indexer Account'
  )
  const [keys, setKeys] = useState<AccountKey[] | undefined>()

  // Map from key name to its API key. This is only returned once by the create
  // or reset key response, so cache it to display to the user.
  const [keyForName, setKeyForName] = useState<Partial<Record<string, string>>>(
    {}
  )

  const [listingKeys, setListingKeys] = useState(false)
  const listKeys = async () => {
    if (!ready) {
      toast.error('Not ready.')
      return
    }

    setListingKeys(true)
    setKeys(undefined)

    try {
      const keysResponse = (await postRequest('/keys/list')) as ListKeysResponse
      setKeys(keysResponse.keys)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setListingKeys(false)
    }
  }

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
      toast.error(err.message)
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

  const [resettingKey, setResettingKey] = useState<string | undefined>()
  const resetKey = async (name: string) => {
    if (!ready) {
      toast.error('Not ready.')
      return
    }

    setResettingKey(name)

    try {
      const request: ResetKeyRequest = {
        name,
      }
      const resetResponse = (await postRequest(
        '/keys/reset',
        request
      )) as ResetKeyResponse

      if ('error' in resetResponse) {
        throw new Error(resetResponse.error)
      }

      setKeyForName((prev) => ({
        ...prev,
        [name]: resetResponse.key,
      }))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setResettingKey(undefined)
    }
  }

  return (
    <main className="flex h-full w-full items-center justify-center">
      {!connected ? (
        <Connect />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-md bg-background-primary p-6">
            <div className="space-y-2">
              <InputLabel name="Name (unique)" />
              <TextInput fieldName="name" register={register} required />
            </div>

            <div className="space-y-2">
              <InputLabel name="Description (optional)" />
              <TextAreaInput fieldName="description" register={register} />
            </div>

            <Button
              center
              disabled={!ready}
              loading={creatingKey}
              onClick={handleSubmit(createKey)}
              size="lg"
            >
              Create key
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-md bg-background-primary p-6">
            <Button
              center
              disabled={!ready}
              loading={listingKeys}
              onClick={listKeys}
              size="lg"
            >
              View keys
            </Button>

            {keys?.map((key) => (
              <div
                key={key.name}
                className="flex flex-col gap-2 rounded-md bg-background-secondary p-4"
              >
                <p className="primary-text">{key.name}</p>
                {key.description && (
                  <p className="secondary-text">{key.description}</p>
                )}

                <div className="flex flex-col gap-2">
                  {key.credits.map((credit) => (
                    <div key={credit.paymentId} className="flex flex-col gap-2">
                      <p className="secondary-text">
                        Paid for: {credit.paidFor ? 'Yes' : 'No'}
                      </p>

                      {credit.paidFor && (
                        <>
                          {credit.paidAt && (
                            <p className="secondary-text">
                              Paid at:{' '}
                              {new Date(credit.paidAt).toLocaleString()}
                            </p>
                          )}

                          <p className="secondary-text">
                            {BigInt(credit.used).toLocaleString()} credits used
                            of {BigInt(credit.amount).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {keyForName[key.name] && (
                  <div className="flex flex-col gap-2 rounded-md bg-background-tertiary p-4">
                    <p className="primary-text">API key</p>
                    <p className="secondary-text">{keyForName[key.name]}</p>

                    <Button
                      center
                      onClick={() =>
                        setKeyForName((prev) => {
                          const { [key.name]: _, ...rest } = prev
                          return rest
                        })
                      }
                      variant="primary"
                    >
                      I saved the key and no longer need to see it
                    </Button>
                  </div>
                )}

                <Button
                  center
                  disabled={!ready}
                  loading={resettingKey === key.name}
                  onClick={() => resetKey(key.name)}
                  variant="secondary"
                >
                  Reset key
                </Button>
              </div>
            ))}
          </div>

          <Button center onClick={disconnect} size="lg" variant="ghost">
            <SensorsOff className="!h-6 !w-6" />
            <p>Disconnect wallet</p>
          </Button>
        </div>
      )}
    </main>
  )
}

export default Home
