import { ExpandCircleDownOutlined, Webhook } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useDeleteWebhook, useUpdateWebhook } from '@/hooks'
import { AccountWebhook } from '@/types'

import { IconButton } from '../button'
import { ButtonPopup, CopyToClipboard, Modal } from '../misc'

export type AccountWebhookCardProps = {
  webhook: AccountWebhook
  onEdit: () => void
}

export const AccountWebhookCard = ({
  webhook,
  onEdit,
}: AccountWebhookCardProps) => {
  const [actionConfirm, setActionConfirm] = useState<'delete' | 'reset'>()
  // Clear after 3 seconds.
  useEffect(() => {
    if (!actionConfirm) {
      return
    }

    const timeout = setTimeout(() => {
      setActionConfirm(undefined)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [actionConfirm])

  const deleteWebhook = useDeleteWebhook(() => {
    // Show toast on success.
    toast.success('Deleted webhook.')

    setActionConfirm(undefined)
  })

  const resetSecret = useUpdateWebhook(() => {
    // Show toast on success.
    toast.success('Reset secret.')

    setActionConfirm(undefined)
  })

  const [secretVisible, setSecretVisible] = useState(false)
  // When resetting webhook, show once secret changes.
  const [resettingSecret, setResettingSecret] = useState(false)
  useEffect(() => {
    if (resettingSecret) {
      setSecretVisible(true)
      setResettingSecret(false)
    }
  }, [resettingSecret, webhook.secret])

  return (
    <div className="relative flex flex-col gap-2 rounded-md bg-background-primary p-4">
      <div className="absolute top-2 right-2">
        <ButtonPopup
          Trigger={({ open, ...props }) => (
            <IconButton
              Icon={ExpandCircleDownOutlined}
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
                  label:
                    actionConfirm === 'delete' ? 'Confirm Delete' : 'Delete',
                  variant: 'danger',
                  loading: deleteWebhook.isLoading,
                  onClick:
                    actionConfirm === 'delete'
                      ? () => deleteWebhook.mutate(webhook.id)
                      : () => setActionConfirm('delete'),
                },
              ],
            },
            {
              label: 'Secret',
              buttons: [
                {
                  label: 'Show',
                  onClick: () => setSecretVisible(true),
                },
                {
                  label: actionConfirm === 'reset' ? 'Confirm Reset' : 'Reset',
                  variant: 'danger',
                  loading: resetSecret.isLoading,
                  onClick:
                    actionConfirm === 'reset'
                      ? () => {
                          setResettingSecret(true)
                          resetSecret.mutate({
                            id: webhook.id,
                            updates: {
                              resetSecret: true,
                            },
                          })
                        }
                      : () => setActionConfirm('reset'),
                },
              ],
            },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Webhook className="!h-5 !w-5 rotate-45" />
          <p className="primary-text grow truncate">{webhook.url}</p>
        </div>

        {webhook.description && (
          <p className="secondary-text">{webhook.description}</p>
        )}
      </div>

      {/* Display secret modal */}
      <Modal
        header={{
          title: 'Secret',
        }}
        onClose={() => setSecretVisible(false)}
        visible={secretVisible}
      >
        <p className="body-text mb-4">
          This secret is used to verify the authenticity of the webhook you
          receive. The base64 signature is found in the{' '}
          <span className="inline-block font-mono font-bold">
            X-Webhook-Signature
          </span>{' '}
          header. The signature generation code can be found{' '}
          <a
            className="font-bold underline"
            href="https://gist.github.com/NoahSaso/670e94466ee067adbe4a605335bc5330"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </p>

        <CopyToClipboard value={webhook.secret} />
      </Modal>
    </div>
  )
}
