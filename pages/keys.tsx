import { WalletConnectionStatus, useWallet } from '@noahsaso/cosmodal'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Loader, ViewKeysWidget } from '@/components'
import { NewKeyWidget } from '@/components/widgets/NewKeyWidget'

const Keys = () => {
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

  return (
    <div className="flex grow flex-col items-center justify-center gap-4">
      <NewKeyWidget />

      <ViewKeysWidget />
    </div>
  )
}

export default Keys
