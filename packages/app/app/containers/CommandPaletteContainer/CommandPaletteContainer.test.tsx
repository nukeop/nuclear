/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { setOption } from '@nuclear/core';

import { CommandPaletteContainer } from '.';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountComponent, setupI18Next } from '../../../test/testUtils';

describe('Command palette container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display a command palette on pressing ctrl+k', async () => {
    const { component } = mountCommandPalette();

    fireEvent.keyDown(document.body, {key: 'K', code: 'KeyK', which: 75, ctrlKey: true});

    await component.findByTestId('command-palette');
  });

  it('should display a command palette on pressing cmd+k', async () => {
    const { component } = mountCommandPalette();

    fireEvent.keyDown(document.body, {key: 'K', code: 'KeyK', which: 75, metaKey: true});

    await component.findByTestId('command-palette');
  });

  it('should lower volume', async () => {
    const { component, store } = mountCommandPalette();

    fireEvent.keyDown(document.body, {key: 'K', code: 'KeyK', which: 75, metaKey: true});
    userEvent.type(component.getByPlaceholderText(/What would you like to do\?/i), 'lower{enter}');
    const state = store.getState();
    
    expect(state.player.volume).toBe(45);
    expect(setOption).toHaveBeenCalledWith('volume', 45);
  });

  it('should raise volume', async () => {
    const { component, store } = mountCommandPalette();

    fireEvent.keyDown(document.body, {key: 'K', code: 'KeyK', which: 75, metaKey: true});
    userEvent.type(component.getByPlaceholderText(/What would you like to do\?/i), 'raise{enter}');
    const state = store.getState();

    expect(state.player.volume).toBe(55);
    expect(setOption).toHaveBeenCalledWith('volume', 55);
  });
  
  const mountCommandPalette = () => {
    return mountComponent(
      <CommandPaletteContainer />,
      ['/'],
      buildStoreState()
        .build()
    );
  };
});
