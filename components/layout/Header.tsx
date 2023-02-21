import { useWallet } from '@noahsaso/cosmodal'

import { ConnectWallet, DisconnectWallet, Link } from '../button'

export const Header = () => {
  const { connected } = useWallet()

  return (
    <div className="flex w-full shrink-0 flex-row items-center justify-between border-b border-border-primary bg-background-tertiary p-6">
      <div className="flex flex-row gap-2">
        <Link href="/">Home</Link>

        {connected && (
          <>
            <Link href="/keys">Keys</Link>
          </>
        )}
      </div>

      {connected ? <DisconnectWallet /> : <ConnectWallet />}
    </div>
  )
}
