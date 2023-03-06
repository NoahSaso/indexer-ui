import { coins } from '@cosmjs/amino'
import { AddRounded } from '@mui/icons-material'
import { useWallet } from '@noahsaso/cosmodal'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import {
  AccountKeyCard,
  Button,
  CopyToClipboard,
  EnsureConnected,
  Header,
  InputLabel,
  Loader,
  Modal,
  NumberInput,
  TextAreaInput,
  TextInput,
} from '@/components'
import {
  useBalance,
  useConfig,
  useCreateKey,
  useKeys,
  useResetKey,
} from '@/hooks'
import {
  AccountKey,
  AccountKeyCreditPaymentSource,
  CreateKeyRequest,
} from '@/types'
import {
  PAY_DECIMALS,
  PAY_DENOM,
  PAY_IMAGE,
  PAY_SYMBOL,
  formatError,
} from '@/utils'

const Keys = () => {
  return (
    <EnsureConnected>
      <InnerKeys />
    </EnsureConnected>
  )
}

export default Keys

type PayForm = {
  credits: number
}

const InnerKeys = () => {
  const { signingCosmWasmClient, address } = useWallet()

  const keys = useKeys()

  const [keyWithApiKey, setKeyWithApiKey] = useState<{
    key: AccountKey
    apiKey: string
  } | null>(null)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  const hideKeyForName = () => {
    setApiKeyVisible(false)
    // Clear after a small delay to let Modal fade away.
    setTimeout(() => setKeyWithApiKey(null), 200)
  }
  const resetKey = useResetKey((id, apiKey) => {
    const key = (keys.isFetched && keys.data?.find((k) => k.id === id)) || null

    // Show toast on success.
    toast.success(`Reset ${key?.name || 'key'}.`)

    // Show API key.
    setKeyWithApiKey(
      key && {
        key,
        apiKey,
      }
    )
    setApiKeyVisible(!!key)
  })

  const [createVisible, setCreateVisible] = useState(false)
  const createKeyForm = useForm<CreateKeyRequest>({
    defaultValues: {
      name: '',
      description: '',
    },
  })
  const createKey = useCreateKey((key, apiKey) => {
    // Show toast on success.
    toast.success(`Created ${key.name}.`)

    // Hide modal.
    setCreateVisible(false)

    // Show API key.
    setKeyWithApiKey({
      key,
      apiKey,
    })
    setApiKeyVisible(true)
  })

  const config = useConfig()
  if (config.data && config.data.nativeDenomAccepted !== PAY_DENOM) {
    console.error('Invalid pay denom.')
  }

  const payMicroBalance = useBalance(PAY_DENOM)
  const payBalance =
    payMicroBalance.isFetched && payMicroBalance.data
      ? Number(payMicroBalance.data.amount) / Math.pow(10, PAY_DECIMALS)
      : 0
  const creditsPerMacroAmount =
    Math.pow(10, PAY_DECIMALS) * (config.data?.creditScaleFactor ?? 0)
  const maxAffordableCredits = Math.floor(payBalance * creditsPerMacroAmount)

  const [payModalVisible, setPayModalVisible] = useState(false)
  const [payingForKeyName, setPayingForKeyName] = useState<string | null>(null)
  const payingForKey =
    (keys.isFetched &&
      keys.data?.find((key) => key.name === payingForKeyName)) ||
    null

  const payForm = useForm<PayForm>({
    defaultValues: {
      credits: 10000,
    },
    mode: 'onChange',
  })
  const credits = payForm.watch('credits') || 0
  const cost = credits / creditsPerMacroAmount

  const [buyingCredits, setBuyingCredits] = useState(false)
  const buyCredits = async () => {
    // Type guard.
    if (!payingForKey) {
      return
    }

    if (!signingCosmWasmClient || !address) {
      toast.error('Connect your wallet to pay for this key.')
      return
    }

    if (!config.data) {
      toast.error('Unable to load config.')
      return
    }

    // Get first credit using the cw-receipt contract source.
    const receiptCredit = payingForKey.credits.find(
      (credit) =>
        credit.paymentSource === AccountKeyCreditPaymentSource.CwReceipt
    )

    if (!receiptCredit) {
      toast.error('Unable to pay for this key.')
      return
    }

    setBuyingCredits(true)

    try {
      // Refresh and get current credits so we can detect when they change.
      const updatedKeys = await keys.refetch()
      const keyCreditsBefore = updatedKeys.data
        ?.find((key) => key.name === payingForKey.name)
        ?.credits.find(
          ({ paymentId }) => paymentId === receiptCredit.paymentId
        )?.amount
      if (keyCreditsBefore === undefined) {
        toast.error('Unable to pay for this key.')
        return
      }

      await signingCosmWasmClient.execute(
        address,
        config.data.cwReceiptPaymentAddress,
        {
          pay: {
            id: receiptCredit.paymentId,
          },
        },
        'auto',
        undefined,
        coins(cost * Math.pow(10, PAY_DECIMALS), PAY_DENOM)
      )

      payMicroBalance.refetch()

      await toast.promise(
        new Promise<void>(async (resolve, reject) => {
          // Wait up to 10 seconds for the key to be updated.
          let attempts = 10
          while (attempts > 0) {
            const updatedKeys = await keys.refetch()
            const keyCreditsAfter = updatedKeys.data
              ?.find((key) => key.name === payingForKey.name)
              ?.credits.find(
                ({ paymentId }) => paymentId === receiptCredit.paymentId
              )?.amount

            // If the key was updated, we're done.
            if (
              keyCreditsAfter !== undefined &&
              keyCreditsAfter !== keyCreditsBefore
            ) {
              resolve()
              return
            }

            // Otherwise, wait a second and try again.
            await new Promise((resolve) => setTimeout(resolve, 1000))

            attempts--
          }

          reject()
        }),
        {
          loading: 'Payment sent, waiting for confirmation...',
          success: 'Payment confirmed.',
          error:
            'Confirmation timed out. Wait a minute and refresh the page, or contact support.',
        }
      )
    } catch (err) {
      // toast.promise rejects with undefined and shows its own error message,
      // so don't handle undefined errors.
      if (err) {
        toast.error(formatError(err))
      }
    } finally {
      setBuyingCredits(false)
    }
  }

  return (
    <>
      <Header
        rightNode={
          <Button
            onClick={() => setCreateVisible(true)}
            variant={
              keys.isFetched && keys.data?.length === 0
                ? 'primary'
                : 'secondary'
            }
          >
            <AddRounded className="!h-4 !w-4" />
            New
          </Button>
        }
        title="Keys"
      />

      <div className="flex flex-col gap-2 pb-6">
        {keys.isLoading ? (
          <Loader />
        ) : (
          keys.data?.map((key) => (
            <AccountKeyCard
              key={key.name}
              accountKey={key}
              onBuyCredits={() => {
                setPayingForKeyName(key.name)
                setPayModalVisible(true)
              }}
              onResetKey={() => resetKey.mutate(key.id)}
              resetLoading={resetKey.isLoading && resetKey.variables === key.id}
            />
          ))
        )}
      </div>

      {/* Create key modal */}
      <Modal
        containerClassName="w-full"
        header={{
          title: 'Create key',
        }}
        onClose={() => setCreateVisible(false)}
        visible={createVisible}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={createKeyForm.handleSubmit((data) =>
            createKey.mutate(data)
          )}
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

      {/* Buy credits modal */}
      <Modal
        header={{
          title: `Buy credits for ${payingForKey?.name}`,
        }}
        onClose={() => setPayModalVisible(false)}
        visible={payModalVisible}
      >
        <div className="space-y-2 rounded-md bg-background-tertiary p-4">
          <p className="body-text">
            1 ${PAY_SYMBOL} buys {creditsPerMacroAmount.toLocaleString()}{' '}
            credits.
          </p>

          <p className="body-text pl-4 font-bold">per single-block query</p>
          <p className="body-text pl-8">1 credit</p>

          <p className="body-text pl-4 font-bold">
            per range query over multiple blocks
          </p>
          <p className="body-text pl-8">1 credit + 1 credit per 10k blocks</p>

          <p className="body-text pl-4 font-bold">per webhook triggered</p>
          <p className="body-text pl-8">
            {config.data?.webhookCreditCost ?? '...'} credits
          </p>
        </div>

        <div className="mt-2 space-y-4 rounded-md bg-background-tertiary p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="legend-text">Remaining credits:</p>

            <p className="font-mono">
              {payingForKey?.credits.some(({ amount }) => amount === '-1')
                ? 'unlimited'
                : payingForKey?.credits
                    .reduce(
                      (acc, credit) =>
                        acc + (Number(credit.amount) - Number(credit.used)),
                      0
                    )
                    ?.toLocaleString()}
            </p>
          </div>

          {payMicroBalance.isFetched && payMicroBalance.data && (
            <div className="flex flex-row items-center justify-between">
              <p className="legend-text">Wallet balance:</p>

              <div className="flex flex-row items-center gap-2">
                <Image alt="" height={20} src={PAY_IMAGE} width={20} />
                <p className="font-mono">
                  {payBalance.toLocaleString(undefined, {
                    maximumFractionDigits: PAY_DECIMALS,
                  })}{' '}
                  ${PAY_SYMBOL}
                </p>
              </div>
            </div>
          )}
        </div>

        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={payForm.handleSubmit(buyCredits)}
        >
          <p className="primary-text -mb-2">How many credits would you like?</p>
          <NumberInput
            error={payForm.formState.errors?.credits}
            fieldName="credits"
            max={maxAffordableCredits}
            min={1}
            register={payForm.register}
            required
            setValue={(...args) =>
              payForm.setValue(...args, {
                shouldValidate: true,
              })
            }
            step={1}
            validations={[
              (value) => value > 0 || 'Must be greater than 0.',
              (value) => Number.isInteger(value) || 'Must be an integer.',
              (value) =>
                value <= maxAffordableCredits || 'Insufficient balance.',
            ]}
            watch={payForm.watch}
          />

          <Button
            loading={buyingCredits}
            size="lg"
            type="submit"
            variant="secondary"
          >
            Buy {credits.toLocaleString()} credit{credits === 1 ? '' : 's'} for{' '}
            {cost.toLocaleString(undefined, {
              maximumFractionDigits: PAY_DECIMALS,
            })}{' '}
            ${PAY_SYMBOL}
          </Button>
        </form>
      </Modal>

      {/* Display API key modal */}
      <Modal
        footerContent={
          <Button className="w-full" onClick={hideKeyForName} variant="primary">
            I saved the key and understand that I cannot view it again
          </Button>
        }
        header={{
          title: `API key for ${keyWithApiKey?.key.name}`,
        }}
        visible={apiKeyVisible && !!keyWithApiKey}
      >
        <p className="body-text mb-4">
          This is the only time you will be able to view this API key. If you
          lose it, you can always reset it and get a new one without losing your
          credits. Click below to copy.
        </p>

        <CopyToClipboard value={keyWithApiKey?.apiKey ?? ''} />
      </Modal>
    </>
  )
}
