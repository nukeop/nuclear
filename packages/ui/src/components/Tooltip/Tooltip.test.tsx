import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('(Snapshot) renders children without tooltip visible', () => {
    const { asFragment } = render(
      <Tooltip content="Hello">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows tooltip on hover and hides on unhover', async () => {
    render(
      <Tooltip content="Settings">
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText('Hover me'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Settings');

    await userEvent.unhover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('does not show tooltip when disabled', async () => {
    render(
      <Tooltip content="Settings" disabled>
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText('Hover me'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders ReactNode content', async () => {
    render(
      <Tooltip content={<span data-testid="custom-content">Custom</span>}>
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText('Hover me'));
    expect(await screen.findByTestId('custom-content')).toBeInTheDocument();
  });
});
