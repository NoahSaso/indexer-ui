import { Sensors } from '@mui/icons-material'
import { WalletConnectionStatus, useWalletManager } from '@noahsaso/cosmodal'

import { Button } from './Button'

export const ConnectWallet = () => {
  const { connect, status } = useWalletManager()

  return (
    <Button
      loading={
        status === WalletConnectionStatus.Initializing ||
        status === WalletConnectionStatus.AttemptingAutoConnection ||
        status === WalletConnectionStatus.Connecting
      }
      onClick={connect}
      size="lg"
    >
      <Sensors className="!h-6 !w-6" />
      Connect wallet
    </Button>
  )
}
