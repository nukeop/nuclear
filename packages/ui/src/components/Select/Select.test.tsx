import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { Select } from '.';

const OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

describe('Select', () => {
  it('(Snapshot) renders basic with description', () => {
    const { container } = render(
      <Select
        id="select-quality"
        label="Quality"
        options={OPTIONS}
        defaultValue="medium"
        description="Choose your preferred playback quality."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders error without description', () => {
    const { container } = render(
      <Select
        id="select-quality-error"
        label="Quality"
        options={OPTIONS}
        error="Please make a selection"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('runs onValueChange callback on selection', async () => {
    const onValueChange = vi.fn();
    render(<Select options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.click(await screen.findByRole('button'));
    await userEvent.click(await screen.findByRole('option', { name: 'High' }));
    expect(onValueChange).toHaveBeenCalledWith('high');
  });

  it('shows placeholder text when value does not match any option', () => {
    render(<Select options={OPTIONS} value="" placeholder="Pick one" />);
    expect(screen.getByRole('button')).toHaveTextContent('Pick one');
  });

  it('shows the selected option label when value matches', () => {
    render(<Select options={OPTIONS} value="high" placeholder="Pick one" />);
    expect(screen.getByRole('button')).toHaveTextContent('High');
  });

  it('updates the displayed value when the controlled value changes', () => {
    const { rerender } = render(
      <Select options={OPTIONS} value="low" placeholder="Pick one" />,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Low');

    rerender(<Select options={OPTIONS} value="" placeholder="Pick one" />);
    expect(screen.getByRole('button')).toHaveTextContent('Pick one');
  });
});
