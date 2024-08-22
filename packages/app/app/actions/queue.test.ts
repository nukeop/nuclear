import { QueueItem } from '../reducers/queue';
import { Queue } from './actionTypes';
import * as QueueOperations from './queue';

describe('Queue actions tests', () => {

  describe('finds streams for track', () => {
    const getSelectedStreamProvider = jest.spyOn(QueueOperations, 'getSelectedStreamProvider');
    const resolveTrackStreams = jest.spyOn(QueueOperations, 'resolveTrackStreams');

    afterEach(() => {
      getSelectedStreamProvider.mockReset();
      resolveTrackStreams.mockReset();
    });

    test('remote track is removed from the queue when no streams are available', () => {
      // Mock an empty search result for streams.
      resolveTrackStreams.mockResolvedValueOnce([]);

      // Configure a dummy stream provider. It is not actually used in this execution path.
      getSelectedStreamProvider.mockReturnValueOnce({});

      // Set up the queue with an arbitrary track, which doesn't have any stream.
      const trackIndex = 123;
      const queueItems: QueueItem[] = [];
      queueItems[trackIndex] = {
        artists: ['Artist Name'],
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
      const findStreamsForTrackOperation = QueueOperations.findStreamsForTrack(trackIndex);
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
