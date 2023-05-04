import { Code, Settings, Webhook } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useDeleteCodeIdSet, useWebhooks } from '@/hooks'
import { AccountCodeIdSet } from '@/types'

import { IconButton } from '../button'
import { ButtonPopup } from '../misc'

export type AccountCodeIdSetCardProps = {
  codeIdSet: AccountCodeIdSet
  onEdit: () => void
}

export const AccountCodeIdSetCard = ({
  codeIdSet,
  onEdit,
}: AccountCodeIdSetCardProps) => {
  const webhooks = useWebhooks()
  const webhooksThatUseCodeIdSet = webhooks.data?.filter((webhook) =>
    webhook.codeIdSetIds.includes(codeIdSet.id)
  )

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  // Clear after 3 seconds.
  useEffect(() => {
    if (!deleteConfirm) {
      return
    }

    const timeout = setTimeout(() => {
      setDeleteConfirm(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [deleteConfirm])

  const deleteCodeIdSet = useDeleteCodeIdSet(() => {
    // Show toast on success.
    toast.success('Deleted code ID set.')

    setDeleteConfirm(false)
  })

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
            {
              label: 'Manage',
              buttons: [
                {
                  label: 'Edit',
                  onClick: onEdit,
                },
                {
                  label: deleteConfirm ? 'Confirm Delete' : 'Delete',
                  variant: 'danger',
                  loading: deleteCodeIdSet.isLoading,
                  onClick: deleteConfirm
                    ? () => deleteCodeIdSet.mutate(codeIdSet.id)
                    : () => setDeleteConfirm(true),
                },
              ],
            },
          ]}
        />
      </div>

      <div className="flex flex-row items-center gap-2">
        <Code className="!h-5 !w-5" />

        <p className="primary-text">
          {codeIdSet.name}{' '}
          <span className="secondary-text">
            ({codeIdSet.codeIds.join(', ')})
          </span>
        </p>
      </div>

      {!!webhooksThatUseCodeIdSet?.length && (
        <>
          <p className="secondary-text mt-2">Used by webhooks:</p>

          <div className="-mt-1 flex flex-col gap-2">
            {webhooksThatUseCodeIdSet.map((webhook) => (
              <div
                key={webhook.id}
                className="flex flex-row items-center gap-2"
              >
                <Webhook className="!h-4 !w-4" />
                <p className="body-text">
                  {webhook.description || webhook.url}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
