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

type RemoteWriteResult = 'skipped' | 'succeeded' | 'failed';

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

  async verify(track: Track, streamId: string): Promise<RemoteWriteResult> {
    await useStreamVerificationStore
      .getState()
      .saveVerification(track, streamId);
    return this.writeRemote(() =>
      streamVerificationApi.postStreamMapping(track, streamId),
    );
  }

  async unverify(track: Track, streamId: string): Promise<RemoteWriteResult> {
    await useStreamVerificationStore.getState().removeVerification(track);
    return this.writeRemote(() =>
      streamVerificationApi.deleteStreamMapping(track, streamId),
    );
  }

  private async writeRemote(
    write: () => Promise<void>,
  ): Promise<RemoteWriteResult> {
    if (!getSetting('core.playback.streamVerificationService')) {
      return 'skipped';
    }

    try {
      await write();
      return 'succeeded';
    } catch (error) {
      Logger.http.error(
        `Failed to write to the stream verification service: ${String(error)}`,
      );
      return 'failed';
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
