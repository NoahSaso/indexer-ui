import { ReactNode } from 'react'

export type HeaderProps = {
  title: string
  rightNode?: ReactNode
}

export const Header = ({ title, rightNode }: HeaderProps) => {
  return (
    <div className="mb-4 flex h-12 flex-row items-center justify-between">
      <p className="header-text">{title}</p>

      {rightNode}
    </div>
  )
}
