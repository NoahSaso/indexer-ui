import { ReactNode } from 'react'

export type HeaderProps = {
  title: string
  subtitle?: string
  rightNode?: ReactNode
}

export const Header = ({ title, subtitle, rightNode }: HeaderProps) => {
  return (
    <div className="mb-4 flex flex-row items-start justify-between gap-6">
      <div className="flex flex-col gap-2">
        <p className="header-text">{title}</p>

        {subtitle && <p className="secondary-text">{subtitle}</p>}
      </div>

      {rightNode}
    </div>
  )
}
