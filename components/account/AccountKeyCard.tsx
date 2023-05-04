import { KeyRounded, Settings } from '@mui/icons-material'
import { useEffect, useState } from 'react'

import { AccountKey, AccountKeyCreditPaymentSource } from '@/types'

import { IconButton } from '../button'
import { ButtonPopup } from '../misc'

export type AccountKeyCardProps = {
  accountKey: AccountKey
  onBuyCredits: () => void
  onResetKey: () => void
  resetLoading: boolean
}

export const AccountKeyCard = ({
  accountKey: { name, description, credits },
  onBuyCredits,
  onResetKey,
  resetLoading,
}: AccountKeyCardProps) => {
  const [resetConfirm, setResetConfirm] = useState(false)
  // Clear after 3 seconds.
  useEffect(() => {
    if (!resetConfirm) {
      return
    }

    const timeout = setTimeout(() => {
      setResetConfirm(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [resetConfirm])

  const totalCredits = credits.reduce(
    (acc, { amount }) => acc + BigInt(amount),
    BigInt(0)
  )
  const usedCredits = credits.reduce(
    (acc, { used }) => acc + BigInt(used),
    BigInt(0)
  )

  return (
    <div className="relative flex flex-col gap-2 rounded-md bg-background-primary p-4">
      <div className="absolute top-2 right-2">
        <ButtonPopup
          Trigger={({ open, ...props }) => (
            <IconButton
              Icon={Settings}
              focused={open}
              variant="ghost"
              {...props}
            />
          )}
          dontCloseOnClick
          popupClassName="w-[8rem]"
          position="left"
          sections={[
            // If the key has a cw-receipt credit, show a buy button.
            ...(credits.some(
              ({ paymentSource }) =>
                paymentSource === AccountKeyCreditPaymentSource.CwReceipt
            )
              ? [
                  {
                    label: 'Credits',
                    buttons: [
                      {
                        label: credits.some(({ paidFor }) => paidFor)
                          ? 'Buy more'
                          : 'Buy',
                        variant: credits.some(({ paidFor }) => paidFor)
                          ? ('secondary' as const)
                          : ('primary' as const),
                        onClick: onBuyCredits,
                      },
                    ],
                  },
                ]
              : []),
            {
              label: 'API Key',
              buttons: [
                {
                  label: resetConfirm ? 'Confirm Reset' : 'Reset',
                  variant: 'danger',
                  loading: resetLoading,
                  onClick: resetConfirm
                    ? onResetKey
                    : () => setResetConfirm(true),
                },
              ],
            },
          ]}
        />
      </div>

      <div className="mr-8 flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <KeyRounded className="!h-5 !w-5 rotate-45" />
          <p className="primary-text">{name}</p>
        </div>

        {description && <p className="secondary-text">{description}</p>}

        <div className="space-y-2">
          {totalCredits !== BigInt(0) ? (
            <>
              <p className="secondary-text">
                {usedCredits.toLocaleString()} credits used of{' '}
                {totalCredits === BigInt(-1)
                  ? 'unlimited'
                  : totalCredits.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="secondary-text">0 credits</p>
          )}
        </div>
      </div>
    </div>
  )
}
