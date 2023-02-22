import { makeSignDoc } from '@cosmjs/amino'
import { useWallet } from '@noahsaso/cosmodal'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { accountToken } from '@/state'
import { LoginResponse } from '@/types'
import { API_BASE, SIGNATURE_TYPE } from '@/utils'

export const useLogin = () => {
  const {
    walletClient,
    publicKey,
    chainInfo,
    address: walletAddress,
  } = useWallet()

  const setToken = useSetRecoilState(accountToken(publicKey?.hex ?? ''))

  const ready = !!walletClient && !!publicKey && !!chainInfo && !!walletAddress

  const login = useCallback(async () => {
    if (!ready) {
      throw new Error('Connect a wallet to continue.')
    }

    // Fetch nonce.
    const nonceResponse: { nonce: number } = await (
      await fetch(API_BASE + '/nonce/' + publicKey.hex)
    ).json()
    if (
      !('nonce' in nonceResponse) ||
      typeof nonceResponse.nonce !== 'number'
    ) {
      console.error('Failed to fetch nonce.', nonceResponse, publicKey.hex)
      throw new Error('Failed to fetch nonce.')
    }

    const auth = {
      type: SIGNATURE_TYPE,
      nonce: nonceResponse.nonce,
      chainId: chainInfo.chainId,
      chainFeeDenom: chainInfo.feeCurrencies[0].coinMinimalDenom,
      chainBech32Prefix: chainInfo.bech32Config.bech32PrefixAccAddr,
      publicKey: publicKey.hex,
    }

    // Sign data.
    const offlineSignerAmino = await walletClient.getOfflineSignerOnlyAmino(
      chainInfo.chainId
    )
    const signDocAmino = makeSignDoc(
      [
        {
          type: SIGNATURE_TYPE,
          value: {
            signer: walletAddress,
            data: JSON.stringify(auth, undefined, 2),
          },
        },
      ],
      {
        gas: '0',
        amount: [
          {
            denom: auth.chainFeeDenom,
            amount: '0',
          },
        ],
      },
      chainInfo.chainId,
      '',
      0,
      0
    )
    const {
      signature: { signature },
    } = await offlineSignerAmino.signAmino(walletAddress, signDocAmino)

    // Send request.
    const response = await fetch(API_BASE + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth,
        signature,
      }),
    })

    const body: LoginResponse = await response.json().catch((err) => ({
      error: `An unexpected error occurred: ${
        err instanceof Error ? err.message : err
      }`,
    }))

    // If errored, throw error.
    if ('error' in body) {
      throw new Error(body.error || 'An unexpected error occurred.')
    }

    // If no error, store token.
    setToken(body.token)
  }, [ready, publicKey, chainInfo, walletClient, walletAddress, setToken])

  return ready ? login : undefined
}
