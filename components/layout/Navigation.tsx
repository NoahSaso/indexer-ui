import { useWallet } from '@noahsaso/cosmodal'

import { ConnectWallet, DisconnectWallet, Link } from '../button'

export const Navigation = () => {
  const { connected } = useWallet()

  return (
    <div className="flex w-full shrink-0 flex-row items-center justify-between border-b border-border-primary bg-background-tertiary p-6">
      <div className="flex flex-row gap-2">
        <Link href="/" invert>
          Home
        </Link>

        {connected && (
          <>
            <Link href="/keys" invert>
              Keys
            </Link>
            <Link href="/webhooks" invert>
              Webhooks
            </Link>
            <Link href="/code-id-sets" invert>
              Code ID Sets
            </Link>
          </>
        )}
      </div>

      {connected ? <DisconnectWallet /> : <ConnectWallet />}
    </div>
  )
}
