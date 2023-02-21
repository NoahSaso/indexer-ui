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
      variant="secondary"
    >
      <Sensors className="!h-5 !w-5" />
      Connect wallet
    </Button>
  )
}
