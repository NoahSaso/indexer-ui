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

export enum AccountWebhookStateKeyType {
  Item = 'item',
  Map = 'map',
}

export type AccountWebhook = {
  id: number
  accountKeyId: number | null
  description: string | null
  url: string
  secret: string
  onlyFirstSet: boolean
  contractAddresses: string[]
  codeIdSetIds: number[]
  stateKey: string | null
  stateKeyType: AccountWebhookStateKeyType
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
  | 'stateKeyType'
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
    | 'stateKeyType'
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

export enum AccountWebhookEventStatus {
  Pending = 'pending',
  Success = 'success',
  Retrying = 'retrying',
  Failure = 'failure',
}

export type ParsedEvent = {
  codeId: number
  contractAddress: string
  blockHeight: string
  blockTimeUnixMs: string
  blockTimestamp: Date
  key: string
  value: string
  valueJson: any
  delete: boolean
}

export type AccountWebhookEvent = {
  uuid: string
  status: AccountWebhookEventStatus
  data: ParsedEvent
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

export type AccountCodeIdSet = {
  id: number
  name: string
  codeIds: number[]
}

export type CreateCodeIdSetRequest = Pick<AccountCodeIdSet, 'name' | 'codeIds'>

export type CreateCodeIdSetResponse =
  | {
      id: number
    }
  | {
      error: string
    }

export type DeleteCodeIdSetResponse =
  | undefined
  | {
      error: string
    }

export type ListCodeIdSetsResponse =
  | {
      codeIdSets: AccountCodeIdSet[]
    }
  | {
      error: string
    }

export type UpdateCodeIdSetRequest = Partial<
  Pick<AccountCodeIdSet, 'name' | 'codeIds'>
>

export type UpdateCodeIdSetResponse =
  | undefined
  | {
      error: string
    }
