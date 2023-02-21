import '../style/index.css'

import { GasPrice } from '@cosmjs/stargate'
import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from '@noahsaso/cosmodal'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

import { ToastNotifications } from '@/components'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletManagerProvider
        defaultChainId={ChainInfoID.Juno1}
        enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
        getSigningCosmWasmClientOptions={(chainInfo) => ({
          gasPrice: GasPrice.fromString(
            '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
          ),
        })}
        getSigningStargateClientOptions={(chainInfo) => ({
          gasPrice: GasPrice.fromString(
            '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
          ),
        })}
        localStorageKey="connectedWallet"
        walletConnectClientMeta={{
          name: 'CosmWasm Indexer',
          description: 'Indexer for CosmWasm smart contracts.',
          url: 'https://indexer.zone',
          icons: [
            (typeof window === 'undefined' ? '' : window.location.origin) +
              '/walletconnect.png',
          ],
        }}
      >
        <RecoilRoot>
          <main className="flex h-full w-full items-center justify-center">
            <Component {...pageProps} />
          </main>
        </RecoilRoot>
      </WalletManagerProvider>

      <ToastNotifications />
    </>
  )
}
