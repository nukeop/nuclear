import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('(Snapshot) renders default state', () => {
    const { container } = render(<CopyButton text="hello" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('copies text to clipboard when clicked', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(() => Promise.resolve());
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);

    render(<CopyButton text="copy me" data-testid="copy-btn" />);

    await user.click(screen.getByTestId('copy-btn'));

    expect(writeText).toHaveBeenCalledWith('copy me');
  });

  it('switches to check icon after copying', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    render(<CopyButton text="copy me" data-testid="copy-btn" />);

    const button = screen.getByTestId('copy-btn');
    const iconBefore = button.querySelector('svg')!.innerHTML;

    await user.click(button);

    const iconAfter = button.querySelector('svg')!.innerHTML;
    expect(iconAfter).not.toBe(iconBefore);
  });
});
