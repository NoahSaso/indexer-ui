import { useWallet } from '@noahsaso/cosmodal'

import { ConnectWallet, DisconnectWallet, ViewKeysWidget } from '@/components'
import { NewKeyWidget } from '@/components/widgets/NewKeyWidget'

const Home = () => {
  const { connected } = useWallet()

  return !connected ? (
    <div>
      <ConnectWallet />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <NewKeyWidget />

      <ViewKeysWidget />

      <DisconnectWallet />
    </div>
  )
}

export default Home
