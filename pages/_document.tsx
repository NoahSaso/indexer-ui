import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="dark" lang="en">
      <Head />
      <body className="body-text bg-background-base antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
