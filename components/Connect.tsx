import { WalletConnectionStatus, useWalletManager } from '@noahsaso/cosmodal'

import { ConnectWallet } from '@dao-dao/stateless/components/wallet/ConnectWallet'

export const Connect = () => {
  const { connect, status } = useWalletManager()

  return (
    <ConnectWallet
      loading={
        status === WalletConnectionStatus.Initializing ||
        status === WalletConnectionStatus.AttemptingAutoConnection ||
        status === WalletConnectionStatus.Connecting
      }
      onConnect={connect}
    />
  )
}
