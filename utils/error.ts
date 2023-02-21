export const formatError = (error: unknown) =>
  error instanceof Error ? error.message : `${error}`
