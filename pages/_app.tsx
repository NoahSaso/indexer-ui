import '../style/index.css'

import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <NextSeo
        canonical="https://indexer.zone"
        description="argus indexer"
        title="argus"
      />
    </>
  )
}
