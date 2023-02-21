import { ReactNode } from 'react'

import { Header } from './Header'

export type AppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <main className="flex h-full w-full flex-col">
      <Header />

      <div className="flex grow flex-col overflow-y-scroll p-6">{children}</div>
    </main>
  )
}
