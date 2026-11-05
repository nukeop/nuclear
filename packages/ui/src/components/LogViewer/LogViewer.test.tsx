import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { LogViewer } from '.';
import type { LogEntryData } from '../LogEntry';

vi.mock('@tanstack/react-virtual', () => import('../../test/mockReactVirtual'));

const baseTimestamp = new Date('2026-02-05T10:00:00.000Z');

const createLog = (
  id: string,
  level: LogEntryData['level'],
  scope: string,
  message: string,
  offsetMs = 0,
  type: 'core' | 'plugin' = 'core',
  target = 'webview',
): LogEntryData => ({
  id,
  timestamp: new Date(baseTimestamp.getTime() + offsetMs),
  level,
  target,
  source: { type, scope },
  message,
});

const sampleLogs: LogEntryData[] = [
  createLog('1', 'error', 'plugins', 'Plugin failed to load', 0),
  createLog('2', 'warn', 'http', 'Rate limited', 1000),
  createLog('3', 'info', 'app', 'Application started', 2000),
  createLog('4', 'debug', 'streaming', 'Resolving stream', 3000),
  createLog('5', 'trace', 'playback', 'Buffer status', 4000),
  createLog('6', 'info', 'youtube-music', 'Searching...', 5000, 'plugin'),
];

describe('LogViewer', () => {
  it('(Snapshot) renders with logs', () => {
    const { container } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[
          'plugins',
          'http',
          'app',
          'streaming',
          'playback',
          'youtube-music',
        ]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders empty state', () => {
    const { container } = render(
      <LogViewer
        logs={[]}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('filters logs by search text', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={['plugins', 'http', 'app']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const searchInput = getByPlaceholderText('Search logs...');
    await user.type(searchInput, 'Rate limited');

    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Plugin failed to load')).not.toBeInTheDocument();
  });

  it('filters logs by level', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={['plugins', 'http', 'app']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const errorChip = getByRole('checkbox', { name: 'error' });
    await user.click(errorChip);

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).not.toBeInTheDocument();
  });

  it('filters logs by scope', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={['plugins', 'http', 'app']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const httpChip = getByRole('checkbox', { name: 'http' });
    await user.click(httpChip);

    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Plugin failed to load')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { getByRole } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={onClear}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    await user.click(getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('calls onExport and shows loading state', async () => {
    const user = userEvent.setup();
    let resolveExport: () => void;
    const exportPromise = new Promise<void>((resolve) => {
      resolveExport = resolve;
    });
    const onExport = vi.fn(() => exportPromise);

    const { getByRole, findByRole } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={onExport}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const exportButton = getByRole('button', { name: /export/i });
    await user.click(exportButton);

    expect(onExport).toHaveBeenCalledOnce();
    expect(exportButton).toBeDisabled();

    resolveExport!();
    const enabledButton = await findByRole('button', { name: /export/i });
    expect(enabledButton).not.toBeDisabled();
  });

  it('calls onOpenLogFolder when button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenLogFolder = vi.fn();
    const { getByRole } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={onOpenLogFolder}
      />,
    );

    await user.click(getByRole('button', { name: /open log folder/i }));
    expect(onOpenLogFolder).toHaveBeenCalledOnce();
  });

  it('displays entry count', () => {
    const { getByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    expect(getByText('6 entries')).toBeInTheDocument();
  });

  it('updates entry count when filtered', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText, getByText, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    expect(getByText('6 entries')).toBeInTheDocument();

    await user.type(getByPlaceholderText('Search logs...'), 'Rate');
    expect(queryByText('6 entries')).not.toBeInTheDocument();
    expect(getByText('1 entry')).toBeInTheDocument();
  });

  it('supports regex search', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    await user.type(getByPlaceholderText('Search logs...'), 'Rate.*limited');
    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Plugin failed to load')).not.toBeInTheDocument();
  });

  it('shows error state for invalid regex', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText, getByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    await user.type(getByPlaceholderText('Search logs...'), '[[invalid');
    expect(getByText('Invalid regex pattern')).toBeInTheDocument();
  });

  it('filters with combined level, scope, and search', async () => {
    const user = userEvent.setup();
    const logs: LogEntryData[] = [
      createLog('1', 'error', 'http', 'HTTP error occurred'),
      createLog('2', 'error', 'plugins', 'Plugin error'),
      createLog('3', 'warn', 'http', 'HTTP warning'),
      createLog('4', 'info', 'http', 'HTTP info'),
    ];
    const { getByRole, getByPlaceholderText, queryByText } = render(
      <LogViewer
        logs={logs}
        scopes={['http', 'plugins']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    await user.click(getByRole('checkbox', { name: 'error' }));
    await user.click(getByRole('checkbox', { name: 'http' }));
    await user.type(getByPlaceholderText('Search logs...'), 'error');

    expect(queryByText('HTTP error occurred')).toBeInTheDocument();
    expect(queryByText('Plugin error')).not.toBeInTheDocument();
    expect(queryByText('HTTP warning')).not.toBeInTheDocument();
  });

  it('handles export failure gracefully', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn(() => Promise.reject(new Error('Export failed')));

    const { getByRole, findByRole } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={onExport}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const exportButton = getByRole('button', { name: /export/i });
    await user.click(exportButton);

    const enabledButton = await findByRole('button', { name: /export/i });
    expect(enabledButton).not.toBeDisabled();
  });

  it('clears stale scope selections when scopes change', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText, rerender } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={['plugins', 'http']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    await user.click(getByRole('checkbox', { name: 'plugins' }));
    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).not.toBeInTheDocument();

    rerender(
      <LogViewer
        logs={sampleLogs}
        scopes={['http', 'app']}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).toBeInTheDocument();
  });

  it('has accessible log container', () => {
    const { getByRole } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const logContainer = getByRole('log');
    expect(logContainer).toHaveAttribute('aria-label', 'Log entries');
  });

  it('clicking a level badge in a log entry filters by that level', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[
          'plugins',
          'http',
          'app',
          'streaming',
          'playback',
          'youtube-music',
        ]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).toBeInTheDocument();

    const levelBadges = getAllByTestId('log-level');
    const warnBadge = levelBadges.find(
      (badge) => badge.textContent === 'WARN',
    )!;
    await user.click(warnBadge);

    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Plugin failed to load')).not.toBeInTheDocument();
    expect(queryByText('Application started')).not.toBeInTheDocument();
  });

  it('clicking a scope chip in a log entry filters by that scope', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[
          'plugins',
          'http',
          'app',
          'streaming',
          'playback',
          'youtube-music',
        ]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).toBeInTheDocument();

    const scopeChips = getAllByTestId('log-scope');
    const httpChip = scopeChips.find((chip) => chip.textContent === 'http')!;
    await user.click(httpChip);

    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Plugin failed to load')).not.toBeInTheDocument();
    expect(queryByText('Application started')).not.toBeInTheDocument();
  });

  it('clicking the same level badge again clears the level filter', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, queryByText } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={[
          'plugins',
          'http',
          'app',
          'streaming',
          'playback',
          'youtube-music',
        ]}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const levelBadges = getAllByTestId('log-level');
    const errorBadge = levelBadges.find(
      (badge) => badge.textContent === 'ERROR',
    )!;
    await user.click(errorBadge);

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).not.toBeInTheDocument();

    const filteredLevelBadges = getAllByTestId('log-level');
    const errorBadgeAfterFilter = filteredLevelBadges.find(
      (badge) => badge.textContent === 'ERROR',
    )!;
    await user.click(errorBadgeAfterFilter);

    expect(queryByText('Plugin failed to load')).toBeInTheDocument();
    expect(queryByText('Rate limited')).toBeInTheDocument();
    expect(queryByText('Application started')).toBeInTheDocument();
  });

  it('scope chips for scopes not in the scopes prop are not clickable', () => {
    const partialScopes = ['plugins', 'http'];
    const { getAllByTestId } = render(
      <LogViewer
        logs={sampleLogs}
        scopes={partialScopes}
        onClear={vi.fn()}
        onExport={vi.fn()}
        onOpenLogFolder={vi.fn()}
      />,
    );

    const scopeChips = getAllByTestId('log-scope');
    const pluginsChip = scopeChips.find(
      (chip) => chip.textContent === 'plugins',
    )!;
    const appChip = scopeChips.find((chip) => chip.textContent === 'app')!;

    expect(pluginsChip.tagName).toBe('BUTTON');
    expect(appChip.tagName).toBe('SPAN');
  });
});
