import { Sensors } from '@mui/icons-material'
import { WalletConnectionStatus, useWalletManager } from '@noahsaso/cosmodal'

import { useLogin } from '@/hooks'

import { Button } from './Button'

export const ConnectWallet = () => {
  const { connect, status } = useWalletManager()
  const { loggingIn, token } = useLogin()

  return (
    <Button
      loading={
        status === WalletConnectionStatus.Initializing ||
        status === WalletConnectionStatus.AttemptingAutoConnection ||
        status === WalletConnectionStatus.Connecting ||
        loggingIn ||
        (status === WalletConnectionStatus.Connected && !token)
      }
      onClick={connect}
      variant="secondary"
    >
      <Sensors className="!h-5 !w-5" />
      Connect wallet
    </Button>
  )
}
