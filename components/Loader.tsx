import clsx from 'clsx'

export type LoaderProps = {
  size?: number
  invert?: boolean
}

export const Loader = ({ size = 24, invert }: LoaderProps) => (
  <div className="flex items-center justify-center">
    <div
      className={clsx(
        'animate-spin border',
        invert ? 'border-background-overlay' : 'border-icon-secondary'
      )}
      style={{
        width: size,
        height: size,
      }}
    ></div>
  </div>
)
