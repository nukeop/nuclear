import { render } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';

import { AnyProps } from '../../../test/testUtils';
import { StreamVerificationContainer } from '.';
import { buildStoreState } from '../../../test/storeBuilders';
import { configureMockStore, TestStoreProvider, setupI18Next } from '../../../test/testUtils';
import { NuclearStreamMappingsService } from '@nuclear/core/src/rest';

describe('StreamVerificationContainer', () => {
  beforeAll(() => {
    process.env.NUCLEAR_VERIFICATION_SERVICE_URL = 'http://verification.nuclear';
    setupI18Next();
  });

  beforeEach(() => {
    fetchMock.reset();
    NuclearStreamMappingsService.get(process.env.NUCLEAR_VERIFICATION_SERVICE_URL).clearTopStreamCache();
  });
      
  it('renders nothing when nothing\'s playing', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('renders the current status when there\'s a track in the queue', () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', {
      stream_id: 'stream-id',
      score: 10
    });
    const store = buildStoreState()
      .withTracksInPlayQueue()
      .withSettings({
        isReady: true,
        useStreamVerification: true
      })
      .build();
    const { component } = mountComponent(store);
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('shows the track as weakly verified if there are few verifications', async () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', {
      stream_id: 'CuklIb9d3fI',
      score: 1
    });
    const store = buildStoreState()
      .withTracksInPlayQueue()
      .withSettings({
        isReady: true,
        useStreamVerification: true
      })
      .build();
    const { component } = mountComponent(store);
    await component.findByText('Weakly verified');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('shows the track as verified if there are many verifications', async () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', {
      stream_id: 'CuklIb9d3fI',
      score: 10
    });
    const store = buildStoreState()
      .withTracksInPlayQueue()    
      .withSettings({
        isReady: true,
        useStreamVerification: true
      })
      .build();
    const { component } = mountComponent(store);
    await component.findByText('Verified');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('shows the track as verified by user if the user has verified it', async () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', {
      stream_id: 'CuklIb9d3fI',
      score: 10,
      self_verified: true
    });
    const store = buildStoreState()
      .withTracksInPlayQueue()
      .withSettings({
        userId: '1',
        useStreamVerification: true,
        isReady: true
      })
      .build();

    const { component } = mountComponent(store);
    await component.findByText('Verified by you');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('lets the user verify the track', async () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', 404);
    fetchMock.post({ url: 'http://verification.nuclear/stream-mappings/verify', body: {
      stream_id: 'CuklIb9d3fI',
      artist: 'test artist 1',
      title: 'test track 1',
      source: 'Test Stream Provider',
      author_id: '1'
    }}, 201);

    const store = buildStoreState()
      .withTracksInPlayQueue()
      .withPlugins()
      .withSettings({
        userId: '1',
        useStreamVerification: true,
        isReady: true
      })
      .build();
    const { component } = mountComponent(store);
    await (await component.findByText('Verify')).click();

    expect(fetchMock.done()).toBeTruthy();
  });

  it('lets the user unverify the track', async () => {
    fetchMock.post('http://verification.nuclear/stream-mappings/top-stream', {
      stream_id: 'CuklIb9d3fI',
      score: 10,
      self_verified: true
    });
    fetchMock.delete({
      url: 'http://verification.nuclear/stream-mappings/unverify',
      body: {
        stream_id: 'CuklIb9d3fI',
        artist: 'test artist 1',
        title: 'test track 1',
        source: 'Test Stream Provider',
        author_id: '1'
      }
    }, 204);
    const store = buildStoreState()
      .withTracksInPlayQueue()
      .withPlugins()
      .withSettings({
        userId: '1',
        useStreamVerification: true,
        isReady: true
      })
      .build();
    const { component } = mountComponent(store);
    
    await (await component.findByText('Unverify')).click();

    expect(fetchMock.done()).toBeTruthy();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withSettings({
          isReady: true,
          useStreamVerification: true
        })
        .build();
    const store = configureMockStore(initialState);
    const component = render(
      <TestStoreProvider
        store={store}
      >
        <StreamVerificationContainer />
      </TestStoreProvider>
    );

    return { component, store };
  };
});
