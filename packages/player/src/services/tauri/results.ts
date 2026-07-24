export type CommandResult<T, E> =
  | { status: 'ok'; data: T }
  | { status: 'error'; error: E };

export const unwrapResult = <T>(result: CommandResult<T, string>): T => {
  if (result.status === 'error') {
    throw new Error(result.error);
  }
  return result.data;
};
