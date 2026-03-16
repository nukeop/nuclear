import { mockIPC } from '@tauri-apps/api/mocks';
import { screen, waitFor, within } from '@testing-library/react';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import {
  SEARCH_RESULTS_PROVIDER_A,
  SEARCH_RESULTS_PROVIDER_B,
} from '../test/fixtures/sources';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { SearchWrapper } from '../views/Search/Search.test-wrapper';
import { SourcesWrapper } from '../views/Sources/Sources.test-wrapper';

describe('Active provider selection', () => {
  beforeEach(() => {
    providersHost.clear();
    useQueueStore.setState({ items: [], isReady: true });
    useSoundStore.setState({ src: null });
    mockIPC((cmd) => {
      if (cmd === 'stream_server_port') {
        return 9100;
      }
    });
  });

  it('searches using the metadata provider selected in Sources', async () => {
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('provider-a')
        .withName('Provider A')
        .withSearchCapabilities(['unified'])
        .withSearch(async () => SEARCH_RESULTS_PROVIDER_A)
        .build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('provider-b')
        .withName('Provider B')
        .withSearchCapabilities(['unified'])
        .withSearch(async () => SEARCH_RESULTS_PROVIDER_B)
        .build(),
    );

    await SourcesWrapper.mount();

    await SourcesWrapper.section('metadata').providerSelect.select(
      'Provider B',
    );

    await SearchWrapper.search('test query');

    await waitFor(() => {
      expect(screen.getByText('Beta Artist')).toBeVisible();
    });
    expect(screen.queryByText('Alpha Artist')).not.toBeInTheDocument();
  });

  it('resolves streams using the streaming provider selected in Sources', async () => {
    providersHost.register(
      MetadataProviderBuilder.albumDetailsProvider()
        .withSearchCapabilities(['unified'])
        .withSearch(async () => SEARCH_RESULTS_PROVIDER_A)
        .build(),
    );
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('stream-a')
        .withName('Stream A')
        .withSearchForTrack(async () => {
          throw new Error('Wrong provider');
        })
        .build(),
    );
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('stream-b')
        .withName('Stream B')
        .withSearchForTrack(async () => [
          createMockCandidate('b-1', 'Stream B result'),
        ])
        .withGetStreamUrl(async (candidateId) =>
          createMockStream(candidateId, { mimeType: 'audio/mpeg' }),
        )
        .build(),
    );

    await SourcesWrapper.mount();

    await SourcesWrapper.section('streaming').providerSelect.select('Stream B');

    await SearchWrapper.search('Giant Steps');
    const albumCard = await screen.findByText('Giant Steps');
    await albumCard.click();
    await screen.findByTestId('album-view');

    await AlbumWrapper.addTrackToQueueByTitle('Countdown');

    const queuePanel = await screen.findByTestId('queue-panel');
    await waitFor(() => {
      const queueItem = within(queuePanel).getByTestId('queue-item');
      expect(queueItem).toHaveTextContent('Countdown');
      expect(
        within(queueItem).queryByTestId('queue-item-error'),
      ).not.toBeInTheDocument();
    });
  });
});
