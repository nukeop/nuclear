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
      getTrackStreams.mockResolvedValueOnce([]);
      const streamProvider = {
        getStreamForId: async (streamId: string) => {
          if (!streamId) {
            throw new Error('The stream ID must not be undefined');
          }
          return {};
        }
      };
      getSelectedStreamProvider
        .mockReturnValueOnce(streamProvider);

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
          // no error should have been dispatched
          expect(dispatchOperation).not.toHaveBeenCalledWith(
            expect.objectContaining({
              payload: expect.not.objectContaining({
                error: expect.anything()
              })
            })
          );
          // assumption:
          // track without streams should have been removed from the queue
          expect(dispatchOperation).toHaveBeenCalledWith({
            type: Queue.REMOVE_QUEUE_ITEM,
            payload: { trackIndex }
          });
        });
    });
  });
});
