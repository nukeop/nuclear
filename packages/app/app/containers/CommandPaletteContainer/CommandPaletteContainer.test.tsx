import { fireEvent } from '@testing-library/react';
import React from 'react';
import { CommandPaletteContainer } from '.';
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

  const mountCommandPalette = () => mountComponent(
    <CommandPaletteContainer />,
    ['/']
  );
});
