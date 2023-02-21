import { SensorsOff } from '@mui/icons-material'
import { useWalletManager } from '@noahsaso/cosmodal'

import { Button } from './Button'

export const DisconnectWallet = () => {
  const { disconnect } = useWalletManager()

  return (
    <Button onClick={disconnect} variant="secondary">
      <SensorsOff className="!h-5 !w-5" />
      Disconnect wallet
    </Button>
  )
}
