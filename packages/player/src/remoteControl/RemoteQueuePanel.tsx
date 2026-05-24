import { FC, useCallback, useEffect, useState } from 'react';

import type { Queue } from '@nuclearplayer/model';
import { QueuePanel } from '@nuclearplayer/ui';

type PlaybackState = {
  status: 'playing' | 'paused' | 'stopped';
  seek: number;
  duration: number;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const RemoteQueuePanel: FC = () => {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [playback, setPlayback] = useState<PlaybackState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const response = await fetch('/api/queue');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: Queue = await response.json();
      setQueue(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queue');
    }
  }, []);

  const fetchPlayback = useCallback(async () => {
    try {
      const response = await fetch('/api/playback');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: PlaybackState = await response.json();
      setPlayback(data);
    } catch {
      setPlayback(null);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    fetchPlayback();
  }, [fetchQueue, fetchPlayback]);

  if (error) {
    return (
      <div className="text-accent-red flex h-full items-center justify-center">
        {error}
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="text-foreground-secondary flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  const currentItem = queue.items[queue.currentIndex];
  const currentTrack = currentItem?.track;

  return (
    <div className="flex h-full flex-col">
      {currentTrack && (
        <NowPlaying
          title={currentTrack.title}
          artist={currentTrack.artists?.[0]?.name}
          status={playback?.status ?? 'stopped'}
          seek={playback?.seek ?? 0}
          duration={playback?.duration ?? 0}
        />
      )}
      <div className="flex-1">
        <QueuePanel
          items={queue.items}
          currentItemId={currentItem?.id}
          reorderable={false}
          labels={{
            emptyTitle: 'Queue is empty',
            emptySubtitle: 'Add some tracks in Nuclear to see them here',
          }}
        />
      </div>
    </div>
  );
};

type NowPlayingProps = {
  title: string;
  artist?: string;
  status: 'playing' | 'paused' | 'stopped';
  seek: number;
  duration: number;
};

const NowPlaying: FC<NowPlayingProps> = ({
  title,
  artist,
  status,
  seek,
  duration,
}) => (
  <div className="border-border bg-background-secondary border-b-(length:--border-width) p-4">
    <div className="flex items-center gap-3">
      <div className="text-accent-green text-sm font-semibold uppercase">
        {status === 'playing'
          ? 'Now playing'
          : status === 'paused'
            ? 'Paused'
            : 'Stopped'}
      </div>
    </div>
    <div className="mt-1 text-lg font-bold">{title}</div>
    {artist && (
      <div className="text-foreground-secondary text-sm">{artist}</div>
    )}
    {duration > 0 && (
      <div className="text-foreground-secondary mt-1 text-xs">
        {formatTime(seek)} / {formatTime(duration)}
      </div>
    )}
  </div>
);
