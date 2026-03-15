import { providersHost } from '../../services/providersHost';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { StreamingProviderBuilder } from '../../test/builders/StreamingProviderBuilder';
import { SourcesWrapper } from './Sources.test-wrapper';

describe('Sources view', () => {
  beforeEach(() => {
    providersHost.clear();
  });

  it('lists registered providers as options in the provider select', async () => {
    providersHost.register(
      new StreamingProviderBuilder().withId('yt').withName('YouTube').build(),
    );
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(
      await SourcesWrapper.section(
        'streaming',
      ).providerSelect.availableOptions(),
    ).toEqual(['YouTube', 'Bandcamp']);
  });

  it('selects the first provider by default', async () => {
    providersHost.register(
      new StreamingProviderBuilder().withId('yt').withName('YouTube').build(),
    );
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'YouTube',
    );
  });

  it('switches the active provider when selecting another one', async () => {
    providersHost.register(
      new StreamingProviderBuilder().withId('yt').withName('YouTube').build(),
    );
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp')
        .build(),
    );

    await SourcesWrapper.mount();
    await SourcesWrapper.section('streaming').providerSelect.select('Bandcamp');

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Bandcamp',
    );
  });

  it('locks the streaming select when metadata provider declares streamingProviderId', async () => {
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp Stream')
        .build(),
    );
    providersHost.register(
      new StreamingProviderBuilder().withId('yt').withName('YouTube').build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('bc-meta')
        .withName('Bandcamp')
        .withStreamingProviderId('bc-stream')
        .build(),
    );

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select('Bandcamp');

    expect(SourcesWrapper.section('streaming').providerSelect.selected()).toBe(
      'Bandcamp Stream',
    );
    expect(
      SourcesWrapper.section('streaming').providerSelect.isDisabled(),
    ).toBe(true);
  });

  it('explains why the streaming select is locked', async () => {
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp Stream')
        .build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('bc-meta')
        .withName('Bandcamp')
        .withStreamingProviderId('bc-stream')
        .build(),
    );

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select('Bandcamp');

    expect(SourcesWrapper.section('streaming').lockedReason).toHaveTextContent(
      'Bandcamp metadata source requires Bandcamp Stream streaming source.',
    );
  });

  it('unlocks the streaming select when switching to a metadata provider without streamingProviderId', async () => {
    providersHost.register(
      new StreamingProviderBuilder()
        .withId('bc-stream')
        .withName('Bandcamp Stream')
        .build(),
    );
    providersHost.register(
      new StreamingProviderBuilder().withId('yt').withName('YouTube').build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('bc-meta')
        .withName('Bandcamp')
        .withStreamingProviderId('bc-stream')
        .build(),
    );
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('lastfm')
        .withName('Last.fm')
        .build(),
    );

    await SourcesWrapper.mount();
    await SourcesWrapper.section('metadata').providerSelect.select('Bandcamp');
    await SourcesWrapper.section('metadata').providerSelect.select('Last.fm');

    expect(
      SourcesWrapper.section('streaming').providerSelect.isDisabled(),
    ).toBe(false);
  });

  it('shows a warning when metadata provider requires a streaming provider that is not registered', async () => {
    providersHost.register(
      new MetadataProviderBuilder()
        .withId('bc-meta')
        .withName('Bandcamp')
        .withStreamingProviderId('bc-stream')
        .build(),
    );

    await SourcesWrapper.mount();

    expect(
      SourcesWrapper.section('metadata').provider('Bandcamp').warning,
    ).toHaveTextContent(
      'Required streaming provider "bc-stream" is not available',
    );
  });
});
