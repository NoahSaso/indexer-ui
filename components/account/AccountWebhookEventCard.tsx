import {
  Cancel,
  CheckCircle,
  Code,
  Help,
  LayersRounded,
  Outbox,
  Refresh,
} from '@mui/icons-material'
import { Link } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TimeAgo from 'react-timeago'

import { useFireWebhookEvent } from '@/hooks'
import {
  AccountWebhook,
  AccountWebhookEvent,
  AccountWebhookEventStatus,
} from '@/types'

import { AccountWebhookEventAttemptCard } from './AccountWebhookEventAttemptCard'
import { Button, DropdownLabel } from '../button'

export type AccountWebhookEventProps = {
  webhook: AccountWebhook
  event: AccountWebhookEvent
}

export const AccountWebhookEventCard = ({
  webhook,
  event,
}: AccountWebhookEventProps) => {
  const [fireCooldown, setFireCooldown] = useState<Date>()
  // Clear once cooldown is past seconds.
  useEffect(() => {
    if (!fireCooldown) {
      return
    }

    const interval = setInterval(() => {
      if (Date.now() >= fireCooldown.getTime()) {
        setFireCooldown(undefined)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [fireCooldown])

  const fire = useFireWebhookEvent((attempt) => {
    // Show toast on success.
    toast.success(`Fired webhook. Status: ${attempt.statusCode}`)

    // Begin 30-second cooldown.
    setFireCooldown(new Date(Date.now() + 30000))
  })

  const [showingAttempts, setShowingAttempts] = useState(false)

  const Status =
    event.status === AccountWebhookEventStatus.Pending
      ? Outbox
      : event.status === AccountWebhookEventStatus.Retrying
      ? Refresh
      : event.status === AccountWebhookEventStatus.Success
      ? CheckCircle
      : event.status === AccountWebhookEventStatus.Failure
      ? Cancel
      : Help

  return (
    <div className="flex flex-col gap-2 rounded-md bg-background-secondary p-4">
      <div className="flex flex-row items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <LayersRounded className="!h-5 !w-5" />
            <p className="primary-text">{event.data.blockHeight}</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Code className="!h-5 !w-5" />
            <p className="primary-text break-all">
              {event.data.contractAddress}
            </p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Status className="!h-5 !w-5 text-icon-tertiary" />
            <p className="primary-text text-text-tertiary">
              {event.status[0].toUpperCase() +
                event.status.slice(1).toLowerCase()}
            </p>
          </div>

          {event.url !== webhook.url && (
            <div className="flex flex-row items-center gap-2">
              <Link className="!h-5 !w-5 text-icon-tertiary" />
              <p className="primary-text break-all text-text-tertiary">
                {event.url}
              </p>
            </div>
          )}
        </div>

        <Button
          disabled={!!fireCooldown}
          loading={fire.isLoading}
          onClick={() =>
            fire.mutate({
              id: webhook.id,
              uuid: event.uuid,
            })
          }
          size="sm"
          variant="secondary"
        >
          {fireCooldown ? (
            <TimeAgo
              date={fireCooldown}
              formatter={(value, unit) =>
                `Cooldown (${value} ${unit}${value === 1 ? '' : 's'} left)`
              }
            />
          ) : (
            'Fire'
          )}
        </Button>
      </div>

      {/* Display attempts */}
      <DropdownLabel
        className="mt-2"
        label={`${event.attempts.length} Attempt${
          event.attempts.length === 1 ? '' : 's'
        }`}
        open={showingAttempts}
        toggle={() => setShowingAttempts((s) => !s)}
      />
      {showingAttempts &&
        event.attempts
          .sort((a, b) => Date.parse(b.sentAt) - Date.parse(a.sentAt))
          .map((attempt) => (
            <AccountWebhookEventAttemptCard
              key={attempt.sentAt}
              attempt={attempt}
            />
          ))}
    </div>
  )
}
