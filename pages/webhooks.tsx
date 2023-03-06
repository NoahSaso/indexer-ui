import { AddRounded } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import {
  AccountWebhookCard,
  Button,
  CreateOrEditWebhookModal,
  EnsureConnected,
  Header,
  Loader,
} from '@/components'
import { useWebhooks } from '@/hooks'

const Webhooks = () => (
  <EnsureConnected>
    <InnerWebhooks />
  </EnsureConnected>
)

export default Webhooks

const InnerWebhooks = () => {
  const webhooks = useWebhooks()

  const [editWebhookId, setEditWebhookId] = useState<number>()
  const [webhookModalVisible, setWebhookModalVisible] = useState(false)

  return (
    <>
      <Header
        rightNode={
          <Button
            onClick={() => setWebhookModalVisible(true)}
            variant={
              webhooks.isFetched && webhooks.data?.length === 0
                ? 'primary'
                : 'secondary'
            }
          >
            <AddRounded className="!h-4 !w-4" />
            New
          </Button>
        }
        title="Webhooks"
      />

      <div className="flex flex-col gap-2 pb-6">
        {webhooks.isLoading ? (
          <Loader />
        ) : (
          webhooks.data?.map((webhook) => (
            <AccountWebhookCard
              key={webhook.id}
              onEdit={() => {
                setEditWebhookId(webhook.id)
                setWebhookModalVisible(true)
              }}
              webhook={webhook}
            />
          ))
        )}
      </div>

      <CreateOrEditWebhookModal
        editWebhookId={editWebhookId}
        onClose={() => {
          setWebhookModalVisible(false)
          setEditWebhookId(undefined)
        }}
        onCreate={() => {
          // Show toast on success.
          toast.success('Created webhook.')
          // Hide modal.
          setWebhookModalVisible(false)
          setEditWebhookId(undefined)
        }}
        onEdit={() => {
          // Show toast on success.
          toast.success('Updated webhook.')
          // Hide modal.
          setWebhookModalVisible(false)
          setEditWebhookId(undefined)
        }}
        visible={webhookModalVisible}
      />
    </>
  )
}
