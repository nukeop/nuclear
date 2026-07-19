export type SoundErrorCode =
  | 'loadFailed'
  | 'unsupportedFormat'
  | 'mseUnavailable'
  | 'appendRejected';

export class SoundError extends Error {
  constructor(
    readonly code: SoundErrorCode,
    readonly details?: string,
  ) {
    super(details ? `${code}: ${details}` : code);
    this.name = 'SoundError';
  }
}
