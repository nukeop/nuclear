import { QueueItem } from '@nuclear/ui';
import React from 'react';
import { DraggableChildrenFn } from 'react-beautiful-dnd';
import { QueueItem as QueueItemType, QueueStore } from '../../../reducers/queue';
import { SettingsState } from '../../../reducers/settings';

export type QueueItemCloneProps = {
  settings: SettingsState;
  queue: QueueStore;
  onSelectTrack: (index: number) => () => void;
  onRemoveTrack: (index: number) => () => void;
  onReloadTrack: (index: number) => () => void;
  formatTrackDuration: (track: QueueItemType) => string;
}

export const QueueItemClone: (props: QueueItemCloneProps) => DraggableChildrenFn = ({
  settings,
  queue,
  onSelectTrack,
  onRemoveTrack,
  onReloadTrack,
  formatTrackDuration
}) => (provided, snapshot, rubric) => <div
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
>
  <QueueItem
    isCompact={settings.compactQueueBar as boolean}
    isCurrent={queue.currentTrack === rubric.source.index}
    track={queue.queueItems[rubric.source.index]}
    onSelect={onSelectTrack(rubric.source.index)}
    onRemove={onRemoveTrack(rubric.source.index)}
    onReload={onReloadTrack(rubric.source.index)}
    duration={formatTrackDuration(queue.queueItems[rubric.source.index])} />
</div>;
