import { providersHost } from '../../services/providersHost';
import { useProvidersStore } from '../../stores/providersStore';
import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import { DiscoveryProviderBuilder } from '../../test/builders/DiscoveryProviderBuilder';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { PlaylistProviderBuilder } from '../../test/builders/PlaylistProviderBuilder';
import { StreamingProviderBuilder } from '../../test/builders/StreamingProviderBuilder';
import {
  PAIRED_METADATA_PROVIDER,
  PAIRED_STREAMING_PROVIDER,
  UNPAIRED_METADATA_PROVIDER,
  UNPAIRED_STREAMING_PROVIDER,
} from '../../test/fixtures/sources';
import { SourcesWrapper } from './Sources.test-wrapper';

describe('Sources view', () => {
  beforeEach(() => {
    providersHost.clear();
  });

  it('(Snapshot) renders the view', async () => {
    providersHost.register(
      new StreamingProviderBuilder().withId('acme').withName('Acme').build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('acme-meta')
        .withName('Acme Metadata')
        .withStreamingProviderId('acme')
        .build(),
    );
    providersHost.register(
      new DashboardProviderBuilder()
        .withId('acme-dash')
        .withName('Acme Dashboard')
        .build(),
    );
    providersHost.register(
      new PlaylistProviderBuilder()
        .withId('acme-playlists')
        .withName('Acme Playlists')
        .build(),
    );

    const { asFragment } = await SourcesWrapper.mount();

    expect(asFragment()).toMatchSnapshot();
  });

  it('lists registered providers as options in the provider select', async () => {
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('beta-stream')
        .withName('Beta Stream')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(
      await SourcesWrapper.section(
        'streaming',
      ).providerSelect.availableOptions(),
    ).toEqual(['Alpha Stream', 'Beta Stream']);
  });

  it('selects the first provider by default', async () => {
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('beta-stream')
        .withName('Beta Stream')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Alpha Stream',
    );
  });

  it('switches the active provider when selecting another one', async () => {
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('beta-stream')
        .withName('Beta Stream')
        .build(),
    );

    await SourcesWrapper.mount();
    await SourcesWrapper.section('streaming').providerSelect.select(
      'Beta Stream',
    );

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Beta Stream',
    );
  });

  it('locks the streaming select when metadata provider declares streamingProviderId', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Beta Search',
    );

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Beta Stream',
    );
    expect(
      SourcesWrapper.section('streaming').providerSelect.isDisabled(),
    ).toBe(true);
  });

  it('explains why the streaming select is locked', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Beta Search',
    );

    expect(SourcesWrapper.section('streaming').lockedReason).toHaveTextContent(
      'Beta Search metadata source requires Beta Stream streaming source.',
    );
  });

  it('unlocks the streaming select when switching to a metadata provider without streamingProviderId', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);
    providersHost.register(UNPAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Beta Search',
    );
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Gamma Search',
    );

    expect(
      SourcesWrapper.section('streaming').providerSelect.isDisabled(),
    ).toBe(false);
  });

  it('shows a warning when metadata provider requires a streaming provider that is not registered', async () => {
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('beta-meta')
        .withName('Beta Search')
        .withStreamingProviderId('beta-stream')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(
      SourcesWrapper.section('metadata').provider('Beta Search').warning,
    ).toHaveTextContent(
      'Required streaming provider "beta-stream" is not available',
    );
  });

  it('syncs the streaming provider in the store when selecting a metadata provider with a locked pair', async () => {
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(UNPAIRED_METADATA_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Beta Search',
    );

    expect(useProvidersStore.getState().active.streaming).toBe('beta-stream');
  });

  it('keeps the streaming provider when switching to a metadata provider without a locked pair', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);
    providersHost.register(UNPAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Beta Search',
    );
    await SourcesWrapper.section('metadata').providerSelect.select(
      'Gamma Search',
    );

    expect(useProvidersStore.getState().active.streaming).toBe('beta-stream');
  });

  it('syncs the streaming provider on initial mount when the first metadata provider has a locked pair', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();

    expect(useProvidersStore.getState().active.streaming).toBe('beta-stream');
  });

  it('activates the paired streaming provider when the active metadata provider has a locked pair on startup', async () => {
    providersHost.register(PAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    // No mount() - the sync happens at the store level, not in React
    expect(useProvidersStore.getState().active.streaming).toBe('beta-stream');
  });

  it('activates the paired streaming provider when it registers after the metadata provider', async () => {
    providersHost.register(PAIRED_METADATA_PROVIDER);
    providersHost.register(PAIRED_STREAMING_PROVIDER);

    expect(useProvidersStore.getState().active.streaming).toBe('beta-stream');
  });

  it('does not lock the streaming select before the paired streaming provider registers', async () => {
    providersHost.register(UNPAIRED_STREAMING_PROVIDER);
    providersHost.register(PAIRED_METADATA_PROVIDER);

    await SourcesWrapper.mount();

    expect(
      SourcesWrapper.section('streaming').providerSelect.isDisabled(),
    ).toBe(false);
    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Alpha Stream',
    );
  });

  it('lists and switches discovery providers', async () => {
    providersHost.register(
      new DiscoveryProviderBuilder()
        .withId('delta-disco')
        .withName('Delta Discovery')
        .build(),
    );
    providersHost.register(
      new DiscoveryProviderBuilder()
        .withId('epsilon-disco')
        .withName('Epsilon Discovery')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(
      await SourcesWrapper.section(
        'discovery',
      ).providerSelect.availableOptions(),
    ).toEqual(['Delta Discovery', 'Epsilon Discovery']);

    await SourcesWrapper.section('discovery').providerSelect.select(
      'Epsilon Discovery',
    );

    expect(SourcesWrapper.section('discovery').providerSelect.selected()).toBe(
      'Epsilon Discovery',
    );
  });
});
