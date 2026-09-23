import type { StreamVerificationStatus, Track } from '@nuclearplayer/model';

import type { TopStream } from '../apis/streamVerificationApi';
import { streamVerificationApi } from '../apis/streamVerificationApi';
import { getSetting } from '../stores/settingsStore';
import { useStreamVerificationStore } from '../stores/streamVerificationStore';
import { Logger } from './logger';

export type VerifiedStream = {
  streamId: string;
  status: Exclude<StreamVerificationStatus, 'loading' | 'unverified'>;
};

class StreamVerification {
  async getVerifiedStream(track: Track): Promise<VerifiedStream | undefined> {
    if (!getSetting('core.playback.streamVerification')) {
      return undefined;
    }

    try {
      const localStreamId =
        useStreamVerificationStore.getState().verifications[
          streamVerificationApi.verificationKey(track)
        ];
      if (localStreamId) {
        return { streamId: localStreamId, status: 'verifiedByUser' };
      }

      if (!getSetting('core.playback.streamVerificationService')) {
        return undefined;
      }

      const topStream = await streamVerificationApi.getTopStream(track);
      if (!topStream) {
        return undefined;
      }

      return this.fromTopStream(topStream);
    } catch (error) {
      Logger.http.error(`Failed to get verified stream: ${String(error)}`);
      return undefined;
    }
  }

  private fromTopStream({
    streamId,
    score,
    selfVerified,
  }: TopStream): VerifiedStream {
    if (selfVerified) {
      return { streamId, status: 'verifiedByUser' };
    }
    if (score < 3) {
      return { streamId, status: 'weaklyVerified' };
    }
    return { streamId, status: 'verified' };
  }
}

export const streamVerification = new StreamVerification();
