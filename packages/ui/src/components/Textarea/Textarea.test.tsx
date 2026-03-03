import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { Textarea } from '.';

describe('Textarea', () => {
  it('(Snapshot) renders with placeholder', () => {
    const { container } = render(
      <Textarea placeholder="Add a description..." />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with secondary tone', () => {
    const { container } = render(
      <Textarea tone="secondary" placeholder="Notes..." />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
