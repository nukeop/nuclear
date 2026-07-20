import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Toaster } from '@nuclearplayer/ui';

import { reportError } from './logging';

vi.mock('@tauri-apps/plugin-log', () => ({
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

describe('reportError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows toast with user message and error description', async () => {
    render(<Toaster richColors />);

    const error = new Error('Connection refused: ECONNREFUSED 127.0.0.1:3000');
    await reportError('plugins', {
      userMessage: 'Failed to load plugin',
      error,
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load plugin')).toBeInTheDocument();
      expect(
        screen.getByText('Connection refused: ECONNREFUSED 127.0.0.1:3000'),
      ).toBeInTheDocument();
    });
  });

  it('truncates toast description to ~100 chars for long errors', async () => {
    render(<Toaster richColors />);

    const longMessage = 'x'.repeat(200);
    const error = new Error(longMessage);
    await reportError('http', {
      userMessage: 'Request failed',
      error,
    });

    await waitFor(() => {
      expect(screen.getByText('Request failed')).toBeInTheDocument();
      const description = screen.getByText(/^x+\.\.\.$/);
      expect(description.textContent?.length).toBeLessThanOrEqual(103);
    });
  });

  it('logs full error details to Tauri logger', async () => {
    const tauriLog = await import('@tauri-apps/plugin-log');
    render(<Toaster richColors />);

    const error = new Error('Connection refused');
    error.stack = 'Error: Connection refused\n    at test.js:1:1';

    await reportError('plugins', {
      userMessage: 'Failed to load plugin',
      error,
    });

    expect(tauriLog.error).toHaveBeenCalledWith(
      expect.stringContaining('[plugins]'),
    );
    expect(tauriLog.error).toHaveBeenCalledWith(
      expect.stringContaining('Connection refused'),
    );
    expect(tauriLog.error).toHaveBeenCalledWith(
      expect.stringContaining('at test.js:1:1'),
    );
  });

  it('handles string errors', async () => {
    render(<Toaster richColors />);

    await reportError('fs', {
      userMessage: 'File operation failed',
      error: 'Permission denied',
    });

    await waitFor(() => {
      expect(screen.getByText('File operation failed')).toBeInTheDocument();
      expect(screen.getByText('Permission denied')).toBeInTheDocument();
    });
  });
});
