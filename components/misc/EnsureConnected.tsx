import { WalletConnectionStatus, useWallet } from '@noahsaso/cosmodal'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

import { Loader } from './Loader'

export type EnsureConnectedProps = {
  children: ReactNode
}

export const EnsureConnected = ({ children }: EnsureConnectedProps) => {
  const { connected, status } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (status === WalletConnectionStatus.ReadyForConnection) {
      router.push('/')
    }
  }, [router, status])

  if (!connected) {
    return <Loader />
  }

  return <>{children}</>
}
