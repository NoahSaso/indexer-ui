import { useWallet } from '@noahsaso/cosmodal'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState } from 'recoil'

import { useCfWorkerAuthPostRequest } from '@/hooks'
import { accountApiKeyForName, accountKeys } from '@/state'
import { ListKeysResponse, ResetKeyRequest, ResetKeyResponse } from '@/types'
import { formatError } from '@/utils'

import { Button } from '../button'

export const ViewKeysWidget = () => {
  const { publicKey: { hex: hexPublicKey } = {} } = useWallet()
  if (!hexPublicKey) {
    throw new Error('Public key should be defined.')
  }

  const { ready, postRequest } = useCfWorkerAuthPostRequest()

  const [keys, setKeys] = useRecoilState(accountKeys(hexPublicKey))
  const [keyForName, setKeyForName] = useRecoilState(
    accountApiKeyForName(hexPublicKey)
  )

  const [listingKeys, setListingKeys] = useState(false)
  const listKeys = async () => {
    if (!ready) {
      toast.error('Not ready.')
      return
    }

    setListingKeys(true)
    setKeys([])

    try {
      const keysResponse = (await postRequest('/keys/list')) as ListKeysResponse
      setKeys(keysResponse.keys)
    } catch (err) {
      toast.error(formatError(err))
    } finally {
      setListingKeys(false)
    }
  }

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
      toast.error(formatError(err))
    } finally {
      setResettingKey(undefined)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-background-primary p-6">
      <Button
        disabled={!ready}
        loading={listingKeys}
        onClick={listKeys}
        size="lg"
        variant="ghost"
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
                        Paid at: {new Date(credit.paidAt).toLocaleString()}
                      </p>
                    )}

                    <p className="secondary-text">
                      {BigInt(credit.used).toLocaleString()} credits used of{' '}
                      {BigInt(credit.amount).toLocaleString()}
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
  )
}
