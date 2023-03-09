import {
  AccessTimeFilledRounded,
  DataArray,
  DataObject,
  RestorePageRounded,
} from '@mui/icons-material'
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <AccessTimeFilledRounded className="!h-5 !w-5" />
          <p className="primary-text text-text-tertiary">
            {new Date(attempt.sentAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <RestorePageRounded className="!h-5 !w-5 text-icon-tertiary" />
          <p className="primary-text text-text-tertiary">
            {attempt.statusCode}
          </p>
        </div>
      </div>

      <DropdownLabel
        className="mt-2"
        label="Request"
        open={showingRequest}
        toggle={() => setShowingRequest((s) => !s)}
      />
      {showingRequest && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <DataArray className="!h-5 !w-5" />
            <p className="primary-text">Headers</p>
          </div>

          <p className="whitespace-pre-wrap rounded-md bg-background-base p-4">
            {JSON.stringify(JSON.parse(attempt.requestHeaders), null, 2)}
          </p>

          <div className="flex flex-row items-center gap-2">
            <DataObject className="!h-5 !w-5" />
            <p className="primary-text">Body</p>
          </div>

          <p className="whitespace-pre-wrap rounded-md bg-background-base p-4">
            {JSON.stringify(JSON.parse(attempt.requestBody), null, 2)}
          </p>
        </div>
      )}

      <DropdownLabel
        label="Response"
        open={showingResponse}
        toggle={() => setShowingResponse((s) => !s)}
      />
      {showingResponse && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <DataArray className="!h-5 !w-5" />
            <p className="primary-text">Headers</p>
          </div>

          <p className="whitespace-pre-wrap rounded-md bg-background-base p-4">
            {attempt.responseHeaders
              ? JSON.stringify(JSON.parse(attempt.responseHeaders), null, 2)
              : 'Empty'}
          </p>

          <div className="flex flex-row items-center gap-2">
            <DataObject className="!h-5 !w-5" />
            <p className="primary-text">Body</p>
          </div>

          <p className="whitespace-pre-wrap rounded-md bg-background-base p-4">
            {attempt.responseBody
              ? attempt.responseBody.startsWith('{')
                ? JSON.stringify(JSON.parse(attempt.responseBody), null, 2)
                : attempt.responseBody
              : 'Empty'}
          </p>
        </div>
      )}
    </div>
  )
}
