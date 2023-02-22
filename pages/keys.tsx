import { coins } from '@cosmjs/amino'
import {
  AddRounded,
  ExpandCircleDownOutlined,
  KeyRounded,
} from '@mui/icons-material'
import { useWallet } from '@noahsaso/cosmodal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useRecoilState } from 'recoil'

import {
  Button,
  ButtonPopup,
  CopyToClipboard,
  EnsureConnected,
  Header,
  IconButton,
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
import { accountApiKeyForName } from '@/state'
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
  const keys = useKeys()
  const createKey = useCreateKey()
  const resetKey = useResetKey()

  const {
    publicKey: { hex: hexPublicKey } = {},
    signingCosmWasmClient,
    address,
  } = useWallet()

  const [keyForName, setKeyForName] = useRecoilState(
    accountApiKeyForName(hexPublicKey ?? '')
  )
  const showKeyForName = Object.entries(keyForName)[0]

  const [keyForNameVisible, setKeyForNameVisible] = useState(false)
  const hideKeyForName = () => {
    setKeyForNameVisible(false)

    // Clear after a small delay to let Modal fade away.
    setTimeout(
      () =>
        showKeyForName &&
        setKeyForName((prev) => {
          const { [showKeyForName[0]]: _, ...rest } = prev
          return rest
        }),
      200
    )
  }

  const [createVisible, setCreateVisible] = useState(false)
  const createKeyForm = useForm<CreateKeyRequest>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const [resetKeyConfirm, setResetKeyConfirm] = useState('')
  // Clear after 5 seconds.
  useEffect(() => {
    if (!resetKeyConfirm) {
      return
    }

    const timeout = setTimeout(() => {
      setResetKeyConfirm('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [resetKeyConfirm])

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
  const [payingForKey, setPayingForKey] = useState<AccountKey | null>(null)

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

    if (
      payingForKey.credits.length !== 1 ||
      payingForKey.credits[0].paymentSource !==
        AccountKeyCreditPaymentSource.CwReceipt
    ) {
      toast.error('Unable to pay for this key.')
      return
    }

    setBuyingCredits(true)

    try {
      // Refresh and get current credits so we can detect when they change.
      const updatedKeys = await keys.refetch()
      const keyCreditsBefore = updatedKeys.data?.find(
        (key) => key.name === payingForKey.name
      )?.credits[0]?.amount
      if (keyCreditsBefore === undefined) {
        toast.error('Unable to pay for this key.')
        return
      }

      await signingCosmWasmClient.execute(
        address,
        config.data.cwReceiptPaymentAddress,
        {
          pay: {
            id: payingForKey.credits[0].paymentId,
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
            const keyCreditsAfter = updatedKeys.data?.find(
              (key) => key.name === payingForKey.name
            )?.credits[0]?.amount

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

      <div className="flex flex-col gap-2">
        {keys.isLoading ? (
          <Loader />
        ) : (
          keys.data?.map((key) => (
            <div
              key={key.name}
              className="relative flex flex-col gap-2 rounded-md bg-background-primary p-4"
            >
              <div className="absolute top-2 right-2">
                <ButtonPopup
                  Trigger={({ open, ...props }) => (
                    <IconButton
                      Icon={ExpandCircleDownOutlined}
                      // className="text-icon-secondary"
                      // focused={open}
                      variant="ghost"
                      {...props}
                    />
                  )}
                  dontCloseOnClick
                  popupClassName="w-[8rem]"
                  position="left"
                  sections={[
                    {
                      label: 'Credits',
                      buttons: [
                        {
                          label: key.credits.some(({ paidFor }) => paidFor)
                            ? 'Buy more'
                            : 'Buy',
                          variant: key.credits.some(({ paidFor }) => paidFor)
                            ? 'secondary'
                            : 'primary',
                          onClick: () => {
                            setPayingForKey(key)
                            setPayModalVisible(true)
                          },
                        },
                      ],
                    },
                    {
                      label: 'API Key',
                      buttons: [
                        {
                          label:
                            resetKeyConfirm === key.name
                              ? 'Confirm Reset'
                              : 'Reset',
                          variant: 'danger',
                          loading:
                            resetKey.isLoading &&
                            resetKey.variables?.name === key.name,
                          onClick: () => {
                            if (resetKeyConfirm === key.name) {
                              resetKey.mutate({ name: key.name })
                              setResetKeyConfirm('')
                              setKeyForNameVisible(true)
                            } else {
                              setResetKeyConfirm(key.name)
                            }
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <KeyRounded className="!h-5 !w-5 rotate-45" />
                  <p className="primary-text">{key.name}</p>
                </div>

                {key.description && (
                  <p className="secondary-text">{key.description}</p>
                )}

                <div className="space-y-2">
                  {key.credits.map((credit) => (
                    <div key={credit.paymentId} className="space-y-2">
                      {credit.paidFor ? (
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
                      ) : (
                        <p className="secondary-text">0 credits</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
          onSubmit={createKeyForm.handleSubmit((data) => {
            createKey.mutate(data)
            setKeyForNameVisible(true)
          })}
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
          title: `Buy credits for "${payingForKey?.name}" key`,
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
          <p className="body-text pl-8">20 credits</p>
        </div>

        <div className="mt-2 space-y-4 rounded-md bg-background-tertiary p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="legend-text">Remaining credits:</p>

            <p className="font-mono">
              {payingForKey?.credits
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
          title: `API key for "${showKeyForName?.[0]}" key`,
        }}
        visible={keyForNameVisible && !!showKeyForName}
      >
        <p className="body-text mb-4">
          This is the only time you will be able to view this API key. If you
          lose it, you can always reset it and get a new one without losing your
          credits. Click below to copy.
        </p>

        <CopyToClipboard value={showKeyForName?.[1] ?? ''} />
      </Modal>
    </>
  )
}
