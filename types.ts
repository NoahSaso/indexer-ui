export type GetConfigResponse =
  | {
      config: {
        cwReceiptPaymentAddress: string
        nativeDenomAccepted: string
        creditScaleFactor: number
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

export type ResetKeyRequest = {
  name: string
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
