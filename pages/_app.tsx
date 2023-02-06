import '@dao-dao/stateless/styles/index.css'
import '../utils/i18n'

import { GasPrice } from '@cosmjs/stargate'
import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from '@noahsaso/cosmodal'
import type { AppProps } from 'next/app'

import { Loader } from '@dao-dao/stateless/components/logo/Loader'
import { ToastNotifications } from '@dao-dao/stateless/components/toasts/ToastNotifications'
import WalletManagerProviderClassNames from '@dao-dao/stateless/styles/WalletManagerProviderClassNames'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletManagerProvider
        classNames={WalletManagerProviderClassNames}
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
        renderLoader={() => <Loader size={42} />}
        walletConnectClientMeta={{
          name: 'Checkmark',
          description: 'Prove your unique identity, securely.',
          url: 'https://checkmark.daodao.zone',
          icons: [
            (typeof window === 'undefined' ? '' : window.location.origin) +
              '/walletconnect.png',
          ],
        }}
      >
        <Component {...pageProps} />
      </WalletManagerProvider>

      <ToastNotifications />
    </>
  )
}
