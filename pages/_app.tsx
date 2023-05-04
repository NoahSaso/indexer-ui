import '../style/index.css'

import { GasPrice } from '@cosmjs/stargate'
import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from '@noahsaso/cosmodal'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'

import { AppLayout, Loader, ToastNotifications } from '@/components'

// react-query
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletManagerProvider
        defaultChainId={ChainInfoID.Juno1}
        defaultUiConfig={{
          classNames: {
            modalOverlay: '!backdrop-brightness-50 !backdrop-filter',
            modalContent:
              '!p-6 !max-w-md !bg-background-base !rounded-lg !border !border-border-secondary !shadow-dp8',
            modalCloseButton:
              '!p-1 !text-icon-tertiary bg-transparent hover:!bg-background-interactive-hover active:!bg-background-interactive-pressed !rounded-full !transition !absolute !top-2 !right-2',
            modalHeader: '!header-text',
            modalSubheader: '!title-text',
            wallet:
              '!rounded-lg !bg-background-secondary !p-4 !shadow-none transition-opacity opacity-100 hover:opacity-80 active:opacity-70',
            walletImage: '!rounded-full',
            walletName: '!primary-text',
            walletDescription: '!caption-text',
            textContent: '!body-text',
          },
          renderLoader: () => <Loader className="mt-2" fill size={32} />,
        }}
        enabledWalletTypes={[
          WalletType.Keplr,
          WalletType.KeplrMobile,
          WalletType.Leap,
        ]}
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
          <QueryClientProvider client={queryClient}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </QueryClientProvider>
        </RecoilRoot>
      </WalletManagerProvider>

      <ToastNotifications />
    </>
  )
}
