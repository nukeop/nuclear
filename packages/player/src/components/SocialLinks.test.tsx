import { openUrl } from '@tauri-apps/plugin-opener';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SocialLinks } from './SocialLinks';

vi.mock('@tauri-apps/plugin-opener', () => ({
  openUrl: vi.fn(),
}));

describe('SocialLinks', () => {
  beforeEach(() => {
    vi.mocked(openUrl).mockClear();
  });

  it('(Snapshot) renders all four social link buttons', () => {
    const { asFragment } = render(<SocialLinks />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('opens Discord URL when Discord button is clicked', async () => {
    render(<SocialLinks />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);

    expect(openUrl).toHaveBeenCalledWith('https://discord.gg/JqPjKxE');
  });

  it('opens GitHub URL when GitHub button is clicked', async () => {
    render(<SocialLinks />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[1]);

    expect(openUrl).toHaveBeenCalledWith('https://github.com/nukeop/nuclear');
  });

  it('opens Mastodon URL when Mastodon button is clicked', async () => {
    render(<SocialLinks />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);

    expect(openUrl).toHaveBeenCalledWith(
      'https://fosstodon.org/@nuclearplayer',
    );
  });

  it('opens Website URL when Website button is clicked', async () => {
    render(<SocialLinks />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[3]);

    expect(openUrl).toHaveBeenCalledWith('https://nuclearplayer.com');
  });
});
