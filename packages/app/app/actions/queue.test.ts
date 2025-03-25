import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';
import { QueueItem } from '../reducers/queue';
import { Queue } from './actionTypes';
import * as QueueActions from './queue';

describe('Queue actions tests', () => {

  describe('finds streams for track', () => {
    const getSelectedStreamProvider = jest.spyOn(QueueActions, 'getSelectedStreamProvider');
    const resolveTrackStreams = jest.spyOn(QueueActions, 'resolveTrackStreams');

    afterEach(() => {
      getSelectedStreamProvider.mockReset();
      resolveTrackStreams.mockReset();
    });

    test('remote track is removed from the queue when no streams are available', () => {
      // Mock an empty search result for streams.
      resolveTrackStreams.mockResolvedValueOnce([]);

      // Configure a dummy stream provider. It is not actually used in this execution path.
      getSelectedStreamProvider.mockReturnValueOnce({} as StreamProviderPlugin);

      // Set up the queue with an arbitrary track, which doesn't have any stream.
      const trackIndex = 123;
      const queueItems: QueueItem[] = [];
      queueItems[trackIndex] = {
        artist: 'Artist Name',
        name: 'Track Name',
        local: false,
        streams: null
      };
      const stateResolver = () => ({
        queue: {
          queueItems
        },
        settings: {
          useStreamVerification: false
        }
      });

      const dispatchOperation = jest.fn();
      const findStreamsForTrackOperation = QueueActions.findStreamsForTrack(trackIndex, 'stream lookup error');
      findStreamsForTrackOperation(dispatchOperation, stateResolver)
        .then(() => {
          // The track without streams should have been removed from the queue.
          expect(dispatchOperation).toHaveBeenCalledWith({
            type: Queue.REMOVE_QUEUE_ITEM,
            payload: { index: trackIndex }
          });
        });
    });
  });
});
