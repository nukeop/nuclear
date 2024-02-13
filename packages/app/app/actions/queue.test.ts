import { QueueItem } from '../reducers/queue';
import { Queue } from './actionTypes';
import * as QueueOperations from './queue';

describe('Queue actions tests', () => {

  describe('finds streams for track', () => {
    const getSelectedStreamProvider = jest.spyOn(QueueOperations, 'getSelectedStreamProvider');
    const getTrackStreams = jest.spyOn(QueueOperations, 'getTrackStreams');

    afterEach(() => {
      getSelectedStreamProvider.mockReset();
      getTrackStreams.mockReset();
    });

    test('remote track is removed from the queue when no streams are available', () => {
      // Mock an empty search result for streams.
      getTrackStreams.mockResolvedValueOnce([]);

      // Configure a stream provider which will throw an error if an attempt is made
      // to search a stream with an invalid ID.
      const streamProvider = {
        sourceName: 'Mocked Stream Provider',
        getStreamForId: async (streamId: string) => {
          if (!streamId) {
            throw new Error('The stream ID must not be undefined');
          }
          return {};
        }
      };
      getSelectedStreamProvider
        .mockReturnValueOnce(streamProvider);

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
      const findStreamsForTrackOperation = QueueOperations.findStreamsForTrack(trackIndex);
      findStreamsForTrackOperation(dispatchOperation, stateResolver)
        .then(() => {
          // No error should have been dispatched:
          // {
          //   'payload': {
          //     'item': {
          //       'error': {}
          //     }
          //   }
          // }
          expect(dispatchOperation).not.toHaveBeenCalledWith(
            expect.objectContaining({
              payload: expect.objectContaining({
                item: expect.objectContaining({
                  error: expect.anything()
                })
              })
            })
          );
          // Assumption:
          // The track without streams should have been removed from the queue.
          expect(dispatchOperation).toHaveBeenCalledWith({
            type: Queue.REMOVE_QUEUE_ITEM,
            payload: { index: trackIndex }
          });
        });
    });
  });
});
