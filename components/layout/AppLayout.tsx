import { useWalletManager } from '@noahsaso/cosmodal'
import { ReactNode, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValue } from 'recoil'

import { useLogin } from '@/hooks'
import { accountToken } from '@/state'
import { formatError } from '@/utils'

import { Navigation } from './Navigation'

export type AppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  // If wallet connected but no auth token, prompt user to login.
  const { connected, connect, disconnect, connectedWallet } = useWalletManager()
  const token = useRecoilValue(
    accountToken(connectedWallet?.publicKey.hex ?? '')
  )
  const { ready, login } = useLogin()

  useEffect(() => {
    if (!connected || !ready) {
      return
    }

    if (!token) {
      const doLogin = async () => {
        try {
          await login()
        } catch (err) {
          toast.error(formatError(err))
          disconnect()
        }
      }

      doLogin()
    }
  }, [connected, connect, disconnect, token, ready, login])

  return (
    <main className="flex h-full w-full flex-col">
      <Navigation />

      <div className="flex w-full max-w-5xl grow flex-col self-center overflow-y-auto p-6">
        {children}
      </div>
    </main>
  )
}
