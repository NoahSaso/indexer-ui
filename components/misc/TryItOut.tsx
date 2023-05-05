import { AddRounded, Link } from '@mui/icons-material'
import { useWallet } from '@noahsaso/cosmodal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useKeys } from '@/hooks'

import { Tag } from './Tag'
import { Button, ConnectWallet } from '../button'
import { TextInput } from '../input'
import { CreateKeyModal } from '../modals'

type FormValues = {
  key: string
  contract: string
  stateKey: string
  stateKeyType: 'item' | 'map'
}

export const TryItOut = () => {
  const { connected } = useWallet()

  const keys = useKeys()
  const [createVisible, setCreateVisible] = useState(false)

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      key: '',
      contract: '',
      stateKey: '',
      stateKeyType: 'item',
    },
  })
  const form = watch()

  const url = `https://juno-mainnet.indexer.zone/contract/${form.contract}/${form.stateKeyType}?key=${form.stateKey}`

  const [queryLoading, setQueryLoading] = useState(false)
  const [queryResult, setQueryResult] = useState()
  const [queryLoaded, setQueryLoaded] = useState(false)
  const onSubmit = async ({ key }: FormValues) => {
    setQueryLoading(true)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': key,
        },
      })

      const result = response.headers.get('Content-Type')?.includes('json')
        ? await response.json()
        : await response.text()

      setQueryResult(result)
      setQueryLoaded(true)
    } finally {
      setQueryLoading(false)
    }
  }

  return connected ? (
    <form
      className="flex flex-col gap-3 rounded-md bg-background-tertiary p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {keys.isFetched &&
        (keys.data?.length ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <p>API Key</p>

              <Button
                onClick={() => setCreateVisible(true)}
                size="sm"
                variant={
                  keys.isFetched && keys.data?.length === 0
                    ? 'primary'
                    : 'secondary'
                }
              >
                <AddRounded className="!h-4 !w-4" />
                New Key
              </Button>
            </div>

            <TextInput
              error={errors?.key}
              fieldName="key"
              register={register}
              required
            />
            <p className="caption-text">
              Use a key you have already created or create a new one.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <p>You have not created any keys yet.</p>

              <Button
                onClick={() => setCreateVisible(true)}
                size="sm"
                variant={
                  keys.isFetched && keys.data?.length === 0
                    ? 'primary'
                    : 'secondary'
                }
              >
                <AddRounded className="!h-4 !w-4" />
                New Key
              </Button>
            </div>
          </div>
        ))}

      <div className="flex flex-col gap-1">
        <p>Contract address</p>
        <TextInput
          error={errors?.contract}
          fieldName="contract"
          placeholder="juno..."
          register={register}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <p>State Key</p>
        <TextInput
          error={errors?.stateKey}
          fieldName="stateKey"
          placeholder="config"
          register={register}
          required
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-md bg-background-secondary p-3">
        <div className="flex flex-row flex-wrap items-center gap-1 font-mono text-xs">
          <Link className="mr-2 !h-6 !w-6 -rotate-45" />

          <p className="shrink-0">
            /contract/<Tag>address</Tag>/item?key=<Tag>state key</Tag>
          </p>

          <div className="ml-6 flex grow flex-row justify-end font-sans">
            <Button loading={queryLoading} type="submit" variant="primary">
              Query
            </Button>
          </div>
        </div>

        {queryLoaded && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">Result</p>
            {typeof queryResult === 'object' ? (
              <pre className="rounded-md bg-background-base p-2 font-mono">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            ) : (
              <p className="font-mono">{queryResult ?? 'undefined'}</p>
            )}
          </div>
        )}
      </div>

      <CreateKeyModal
        onClose={() => setCreateVisible(false)}
        onCreateKey={(_, key) => setValue('key', key)}
        visible={createVisible}
      />
    </form>
  ) : (
    <>
      <p>Connect a wallet to make an account.</p>

      <ConnectWallet />
    </>
  )
}
