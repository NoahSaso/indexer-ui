import clsx from 'clsx'

export type LoaderProps = {
  size?: number
  invert?: boolean
  fill?: boolean
  className?: string
}

export const Loader = ({ size = 24, invert, fill, className }: LoaderProps) => (
  <div
    className={clsx(
      'flex items-center justify-center',
      fill && 'h-full w-full grow',
      className
    )}
  >
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
