import { useState } from 'react'

import { AccountWebhookEventAttempt } from '@/types'

import { DropdownLabel } from '../button'

export type AccountWebhookEventAttemptProps = {
  attempt: AccountWebhookEventAttempt
}

export const AccountWebhookEventAttemptCard = ({
  attempt,
}: AccountWebhookEventAttemptProps) => {
  const [showingRequest, setShowingRequest] = useState(false)
  const [showingResponse, setShowingResponse] = useState(false)

  return (
    <div className="flex flex-col gap-2 rounded-md bg-background-secondary p-4">
      <div className="flex flex-row flex-wrap justify-between gap-6">
        <p className="secondary-text">
          {new Date(attempt.sentAt).toLocaleString()}
        </p>
        <p>
          <span className="secondary-text">Status:</span> {attempt.statusCode}
        </p>
      </div>

      <DropdownLabel
        className="mt-2"
        label="Request"
        open={showingRequest}
        toggle={() => setShowingRequest((s) => !s)}
      />
      {showingRequest && (
        <div className="ml-6 flex flex-col gap-2">
          <div className="space-y-2 rounded-md bg-background-tertiary p-4">
            <p className="primary-text">Headers</p>
            <p className="whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(attempt.requestHeaders), null, 2)}
            </p>
          </div>

          <div className="space-y-2 rounded-md bg-background-tertiary p-4">
            <p className="primary-text">Body</p>
            <p className="whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(attempt.requestBody), null, 2)}
            </p>
          </div>
        </div>
      )}

      <DropdownLabel
        label="Response"
        open={showingResponse}
        toggle={() => setShowingResponse((s) => !s)}
      />
      {showingResponse && (
        <div className="ml-6 flex flex-col gap-2">
          <div className="space-y-2 rounded-md bg-background-tertiary p-4">
            <p className="primary-text">Headers</p>
            <p className="whitespace-pre-wrap">
              {attempt.responseHeaders
                ? JSON.stringify(JSON.parse(attempt.responseHeaders), null, 2)
                : 'Empty'}
            </p>
          </div>

          <div className="space-y-2 rounded-md bg-background-tertiary p-4">
            <p className="primary-text">Body</p>
            <p className="whitespace-pre-wrap">
              {attempt.responseBody
                ? attempt.responseBody.startsWith('{')
                  ? JSON.stringify(JSON.parse(attempt.responseBody), null, 2)
                  : attempt.responseBody
                : 'Empty'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
