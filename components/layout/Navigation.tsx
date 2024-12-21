import { useWallet } from '@noahsaso/cosmodal'

import { useLogin } from '@/hooks'

import { ConnectWallet, DisconnectWallet, Link } from '../button'

export const Navigation = () => {
  const { connected } = useWallet()
  const { token, loggingIn } = useLogin()

  return (
    <div className="flex w-full shrink-0 flex-row items-center justify-between border-b border-border-primary bg-background-tertiary p-6">
      <div className="flex flex-row gap-2">
        <Link href="/" invert>
          Home
        </Link>

        {connected && !!token && (
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

      {connected && !loggingIn && !!token ? (
        <DisconnectWallet />
      ) : (
        <ConnectWallet />
      )}
    </div>
  )
}
