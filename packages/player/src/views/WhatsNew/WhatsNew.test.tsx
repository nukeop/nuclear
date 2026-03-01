import {
  SINGLE_VERSION_CHANGELOG,
  TEST_CHANGELOG,
} from '../../test/fixtures/changelog';
import { WhatsNewWrapper } from './WhatsNew.test-wrapper';

vi.mock('../../../changelog.json', () => ({
  default: TEST_CHANGELOG,
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.0.0'),
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  attachLogger: vi.fn().mockResolvedValue(() => {}),
  warn: () => Promise.resolve(),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
  error: () => Promise.resolve(),
}));

describe("What's New view", () => {
  it('renders the view title', async () => {
    await WhatsNewWrapper.mount();
    expect(WhatsNewWrapper.title).toHaveTextContent("What's New");
  });

  it('shows the latest version with its date', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.header).toHaveTextContent('1.12.0');
    expect(latest.header).toHaveTextContent('Mar 1, 2026');
  });

  it('only shows the latest version by default', async () => {
    await WhatsNewWrapper.mount();
    expect(WhatsNewWrapper.version('1.12.0').header).toBeInTheDocument();
    expect(WhatsNewWrapper.version('1.11.1').query).toBeNull();
  });

  it('displays change descriptions', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(0).description).toHaveTextContent(
      'Support importing legacy format playlists',
    );
    expect(latest.entry(1).description).toHaveTextContent(
      'Fixed audio stuttering on track transition',
    );
    expect(latest.entry(2).description).toHaveTextContent(
      'Improved plugin loading performance',
    );
  });

  it('shows type badges on each entry', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(0).typeBadge).toHaveTextContent('Feature');
    expect(latest.entry(1).typeBadge).toHaveTextContent('Fix');
    expect(latest.entry(2).typeBadge).toHaveTextContent('Improvement');
  });

  it('shows contributor usernames with @ prefix', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(0).contributor).toHaveTextContent('@nukeop');
    expect(latest.entry(2).contributor).toHaveTextContent('@someDev');
  });

  it('does not render contributor when not provided', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(1).contributor).toBeNull();
  });

  it('shows tags when present', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(0).tags).toHaveLength(1);
    expect(latest.entry(0).tags[0]).toHaveTextContent('Playlists');
  });

  it('does not render tags when not provided', async () => {
    await WhatsNewWrapper.mount();
    const latest = WhatsNewWrapper.version('1.12.0');
    expect(latest.entry(1).tags).toHaveLength(0);
  });

  it('shows the count of older versions in the see more button', async () => {
    await WhatsNewWrapper.mount();
    expect(WhatsNewWrapper.seeMoreButton.element).toHaveTextContent(
      'See more (1 older)',
    );
  });

  it('reveals older versions when see more is clicked', async () => {
    await WhatsNewWrapper.mount();
    await WhatsNewWrapper.seeMoreButton.click();

    const older = WhatsNewWrapper.version('1.11.1');
    expect(older.header).toHaveTextContent('1.11.1');
    expect(older.header).toHaveTextContent('Feb 15, 2026');
    expect(older.entry(0).description).toHaveTextContent(
      'Added new website with dark mode',
    );
    expect(older.entry(0).typeBadge).toHaveTextContent('Feature');
    expect(older.entry(0).tags[0]).toHaveTextContent('Website');
    expect(older.entry(1).typeBadge).toHaveTextContent('Docs');
  });

  it('hides older versions when toggled back', async () => {
    await WhatsNewWrapper.mount();
    await WhatsNewWrapper.seeMoreButton.click();
    await WhatsNewWrapper.seeMoreButton.click();

    expect(WhatsNewWrapper.version('1.11.1').query).toBeNull();
  });

  it('does not show see more button with only one version', async () => {
    await WhatsNewWrapper.mount(SINGLE_VERSION_CHANGELOG);
    expect(WhatsNewWrapper.seeMoreButton.query).not.toBeInTheDocument();
  });
});
