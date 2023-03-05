export type GetConfigResponse =
  | {
      config: {
        cwReceiptPaymentAddress: string
        nativeDenomAccepted: string
        creditScaleFactor: number
        webhookCreditCost: number
      }
    }
  | {
      error: string
    }

export enum AccountKeyCreditPaymentSource {
  // cw-receipt contract.
  CwReceipt = 'cw-receipt',
  // Manually credited.
  Manual = 'manual',
}

export type AccountKey = {
  id: number
  name: string
  description: string | null
  credits: {
    paymentSource: AccountKeyCreditPaymentSource
    paymentId: string
    paidFor: boolean
    paidAt: string | null
    amount: string // serialized bigint
    used: string // serialized bigint
  }[]
}

export type CreateKeyRequest = {
  name: string
  description: string | null
}

export type CreateKeyResponse =
  | {
      apiKey: string
      createdKey: AccountKey
    }
  | {
      error: string
    }

export type ListKeysResponse =
  | {
      keys: AccountKey[]
    }
  | {
      error: string
    }

export type ResetKeyResponse =
  | {
      key: string
    }
  | {
      error: string
    }

export type LoginResponse =
  | {
      token: string
    }
  | {
      error: string
    }

export type AccountWebhook = {
  keyId: number | null
  description: string | null
  url: string
  secret: string
  onlyFirstSet: boolean
  contractAddresses: string[]
  codeIdSetIds: number[]
  stateKey: string | null
  stateKeyIsPrefix: boolean | null
}

export type ListWebhooksResponse =
  | {
      webhooks: AccountWebhook[]
    }
  | {
      error: string
    }

export type CreateWebhookRequest = Pick<
  AccountWebhook,
  | 'description'
  | 'url'
  | 'onlyFirstSet'
  | 'contractAddresses'
  | 'stateKey'
  | 'stateKeyIsPrefix'
> & {
  accountKeyId: number
  codeIdSetIds: number[]
}

export type CreateWebhookResponse =
  | undefined
  | {
      error: string
    }

export type DeleteWebhookResponse =
  | undefined
  | {
      error: string
    }

export type UpdateWebhookRequest = Partial<
  Pick<
    AccountWebhook,
    | 'description'
    | 'url'
    | 'onlyFirstSet'
    | 'contractAddresses'
    | 'stateKey'
    | 'stateKeyIsPrefix'
  > & {
    accountKeyId: number
    codeIdSetIds: number[]
    resetSecret: boolean
  }
>

export type UpdateWebhookResponse =
  | undefined
  | {
      error: string
    }

export type AccountWebhookEventAttempt = {
  sentAt: string
  url: string
  requestBody: string
  requestHeaders: string
  responseBody: string | null
  responseHeaders: string | null
  statusCode: number
}

export type AccountWebhookEvent = {
  uuid: string
  url: string
  attempts: AccountWebhookEventAttempt[]
}

export type GetWebhookEventsResponse =
  | {
      events: AccountWebhookEvent[]
    }
  | {
      error: string
    }

export type FireWebhookEventResponse =
  | {
      attempt: AccountWebhookEventAttempt
    }
  | {
      error: string
    }
