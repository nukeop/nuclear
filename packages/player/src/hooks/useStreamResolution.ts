import { useEffect, useRef } from 'react';

import { AudioSource } from '@nuclearplayer/hifi';
import type { TFunction } from '@nuclearplayer/i18n';
import { useTranslation } from '@nuclearplayer/i18n';
import type { QueueItem, StreamCandidate, Track } from '@nuclearplayer/model';

import { streamingHost } from '../services/streamingHost';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';

// Encode the URL in base64 and use our custom protocol to bypass CORS
// Check packages/player/src-tauri/src/stream_proxy.rs to see how this works
const proxyStreamUrl = (url: string): string => {
  const encoded = btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `nuclear-stream://localhost/${encoded}`;
};

const buildAudioSource = (candidate: StreamCandidate): AudioSource => {
  const { stream } = candidate;
  if (!stream) {
    return { url: candidate.id, protocol: 'http' };
  }

  if (stream.protocol === 'hls') {
    return { url: stream.url, protocol: 'hls' };
  }

  return { url: proxyStreamUrl(stream.url), protocol: stream.protocol };
};

const setItemError = (itemId: string, errorKey: string, t: TFunction): void => {
  useQueueStore.getState().updateItemState(itemId, {
    status: 'error',
    error: t(errorKey),
  });
};

const updateItemCandidates = (
  item: QueueItem,
  candidates: StreamCandidate[],
): void => {
  useQueueStore.getState().updateItemState(item.id, {
    track: { ...item.track, streamCandidates: candidates },
  });
};

const resolveCandidates = async (
  track: Track,
): Promise<StreamCandidate[] | undefined> => {
  if (track.streamCandidates?.length) {
    return track.streamCandidates;
  }

  const result = await streamingHost.resolveCandidatesForTrack(track);
  return result.success ? result.candidates : undefined;
};

const tryResolveNextCandidate = async (
  candidates: StreamCandidate[],
): Promise<
  { resolved: StreamCandidate; updated: StreamCandidate[] } | undefined
> => {
  const candidate = candidates.find((c) => !c.failed);
  if (!candidate) {
    return undefined;
  }

  const resolved = await streamingHost.resolveStreamForCandidate(candidate);
  if (!resolved) {
    return undefined;
  }

  const updated = candidates.map((c) => (c.id === resolved.id ? resolved : c));
  return { resolved, updated };
};

const resolveStreamWithFallback = async (
  candidates: StreamCandidate[],
  item: QueueItem,
): Promise<StreamCandidate | undefined> => {
  const tryNext = async (
    remaining: StreamCandidate[],
  ): Promise<StreamCandidate | undefined> => {
    const result = await tryResolveNextCandidate(remaining);
    if (!result) {
      return undefined;
    }

    updateItemCandidates(item, result.updated);

    if (result.resolved.stream && !result.resolved.failed) {
      return result.resolved;
    }

    return tryNext(result.updated);
  };

  return tryNext(candidates);
};

const resolveAndPlay = async (item: QueueItem, t: TFunction): Promise<void> => {
  const { updateItemState } = useQueueStore.getState();
  const { setSrc, play } = useSoundStore.getState();

  updateItemState(item.id, { status: 'loading', error: undefined });

  const candidates = await resolveCandidates(item.track);
  if (!candidates) {
    setItemError(item.id, 'errors.noCandidatesFound', t);
    return;
  }

  updateItemCandidates(item, candidates);

  const resolvedCandidate = await resolveStreamWithFallback(candidates, item);
  if (!resolvedCandidate?.stream) {
    setItemError(item.id, 'errors.allCandidatesFailed', t);
    return;
  }

  setSrc(buildAudioSource(resolvedCandidate));
  play();
};

export const useStreamResolution = (): void => {
  const { t } = useTranslation('streaming');
  const currentItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleItemChange = (currentItem: QueueItem | undefined): void => {
      if (!currentItem || currentItem.id === currentItemIdRef.current) {
        return;
      }
      currentItemIdRef.current = currentItem.id;
      void resolveAndPlay(currentItem, t);
    };

    const unsubscribe = useQueueStore.subscribe((state) => {
      handleItemChange(state.getCurrentItem());
    });

    handleItemChange(useQueueStore.getState().getCurrentItem());

    return unsubscribe;
  }, [t]);
};
