import {waitFor} from '@testing-library/react';
import VisualizerContainer from '.';
import { mountedComponentFactory } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Visualizer Overlay - shuffle activation', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should enable shuffle when disabled and the button is clicked', async () => {
    const { component, store } = mountComponent({
      settings: {
        ['visualizer.shuffle']: false
      }
    });
    await waitFor(() => component.getByTestId(/shuffle-button/i).click());
    const state = store.getState();
    expect(state.settings['visualizer.shuffle']).toEqual(true);
  });

  it('should disable shuffle when enabled and the button is clicked', async () => {
    const { component, store } = mountComponent({
      settings: {
        ['visualizer.shuffle']: true
      }
    });
    await waitFor(() => component.getByTestId(/shuffle-button/i).click());
    const state = store.getState();
    expect(state.settings['visualizer.shuffle']).toEqual(false);
  });

  const mountComponent = mountedComponentFactory(
    ['/visualizer'],
    buildStoreState()
      .build(),
    VisualizerContainer
  );
});
