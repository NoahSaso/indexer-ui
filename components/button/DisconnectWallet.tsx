import { SensorsOff } from '@mui/icons-material'
import { useWalletManager } from '@noahsaso/cosmodal'

import { Button } from './Button'

export const DisconnectWallet = () => {
  const { disconnect } = useWalletManager()

  return (
    <Button onClick={disconnect} size="lg" variant="ghost">
      <SensorsOff className="!h-6 !w-6" />
      Disconnect wallet
    </Button>
  )
}
