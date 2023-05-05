import { Link } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { Tag } from './Tag'
import { Button } from '../button'
import { SegmentedControls, TextInput } from '../input'

type FormValues = {
  contract: string
  stateKey: string
  stateKeyType: 'item' | 'map'
}

export const TryItOut = () => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
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
  const [queryCooldown, setQueryCooldown] = useState(0)
  const onSubmit = async () => {
    setQueryLoading(true)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': 'test',
        },
      })

      const result = response.headers.get('Content-Type')?.includes('json')
        ? await response.json()
        : await response.text()

      setQueryResult(result)
      setQueryLoaded(true)
      setQueryCooldown(10)
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : `${err}`)
    } finally {
      setQueryLoading(false)
    }
  }

  // Count down cooldown.
  const cooldownActive = queryCooldown > 0
  useEffect(() => {
    if (!cooldownActive) {
      return
    }

    const interval = setInterval(() => {
      setQueryCooldown((cooldown) => (cooldown > 0 ? cooldown - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownActive])

  return (
    <form
      className="flex flex-col gap-3 rounded-md bg-background-tertiary p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
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
        <p>State Key Type</p>
        <SegmentedControls
          onSelect={(value) => setValue('stateKeyType', value)}
          selected={form.stateKeyType}
          tabs={[
            {
              label: 'Item',
              value: 'item' as const,
            },
            {
              label: 'Map',
              value: 'map' as const,
            },
          ]}
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
            /contract/<Tag>address</Tag>/<Tag>{form.stateKeyType}</Tag>?key=
            <Tag>state key</Tag>
          </p>

          <div className="ml-6 flex grow flex-row justify-end font-sans">
            <Button
              disabled={cooldownActive}
              loading={queryLoading}
              type="submit"
              variant="primary"
            >
              Query{cooldownActive && ` in ${queryCooldown}s`}
            </Button>
          </div>
        </div>

        {queryLoaded && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">Result</p>
            {typeof queryResult === 'object' ? (
              <pre className="whitespace-pre-wrap break-all rounded-md bg-background-base p-2 font-mono">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            ) : (
              <p className="font-mono">{queryResult || 'undefined'}</p>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
