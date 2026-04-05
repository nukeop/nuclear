import { invoke } from '@tauri-apps/api/core';
import { attachLogger } from '@tauri-apps/plugin-log';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  initLogStream,
  resetLogStreamForTesting,
  useLogStream,
} from './useLogStream';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  attachLogger: vi.fn(),
}));

describe('useLogStream', () => {
  let logCallback: (record: { level: number; message: string }) => void;

  beforeEach(() => {
    vi.useFakeTimers();
    resetLogStreamForTesting();

    vi.mocked(attachLogger).mockImplementation(async (callback) => {
      logCallback = callback;
      return vi.fn();
    });

    vi.mocked(invoke).mockResolvedValue([]);

    initLogStream();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('fetches startup logs on mount', async () => {
    resetLogStreamForTesting();

    vi.mocked(invoke).mockResolvedValue([
      {
        timestamp: '2026-02-04T10:00:00Z',
        level: 'INFO',
        message: '[INFO][webview] [app] Starting up',
      },
    ]);

    initLogStream();

    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(100);

    expect(invoke).toHaveBeenCalledWith('get_startup_logs');
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toMatchObject({
      level: 'info',
      target: 'webview',
      message: 'Starting up',
      source: { type: 'core', scope: 'app' },
    });
  });

  it('parses incoming log messages and extracts scope', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({
        level: 3,
        message: '[INFO][webview] [streaming] Resolving track',
      });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toMatchObject({
      level: 'info',
      target: 'webview',
      message: 'Resolving track',
      source: { type: 'core', scope: 'streaming' },
    });
  });

  it('identifies plugin logs from plugin: prefix', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({
        level: 3,
        message: '[INFO][webview] [plugin:youtube-music] Searching',
      });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs[0]).toMatchObject({
      level: 'info',
      target: 'webview',
      message: 'Searching',
      source: { type: 'plugin', scope: 'youtube-music' },
    });
  });

  it('handles Tauri-internal logs without scope prefix', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({
        level: 2,
        message: '[DEBUG][reqwest::connect] starting new connection',
      });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs[0]).toMatchObject({
      level: 'debug',
      target: 'reqwest::connect',
      message: 'starting new connection',
      source: { type: 'core', scope: '' },
    });
  });

  it('handles messages without any format', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 4, message: 'Raw message without format' });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs[0]).toMatchObject({
      level: 'warn',
      target: '',
      message: 'Raw message without format',
      source: { type: 'core', scope: '' },
    });
  });

  it('maps Tauri log levels correctly', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 1, message: '[TRACE][webview] [app] trace' });
      logCallback({ level: 2, message: '[DEBUG][webview] [app] debug' });
      logCallback({ level: 3, message: '[INFO][webview] [app] info' });
      logCallback({ level: 4, message: '[WARN][webview] [app] warn' });
      logCallback({ level: 5, message: '[ERROR][webview] [app] error' });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs.map((l: { level: string }) => l.level)).toEqual([
      'trace',
      'debug',
      'info',
      'warn',
      'error',
    ]);
  });

  it('limits buffer to 1000 entries (ring buffer)', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      for (let i = 0; i < 1050; i++) {
        logCallback({
          level: 3,
          message: `[INFO][webview] [app] Message ${i}`,
        });
      }
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs).toHaveLength(1000);
    expect(result.current.logs[0].message).toBe('Message 50');
    expect(result.current.logs[999].message).toBe('Message 1049');
  });

  it('clears logs and continues receiving new ones', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 3, message: '[INFO][webview] [app] Before clear' });
    });

    await vi.advanceTimersByTimeAsync(100);
    expect(result.current.logs).toHaveLength(1);

    act(() => {
      result.current.clearLogs();
    });

    await vi.advanceTimersByTimeAsync(100);
    expect(result.current.logs).toHaveLength(0);

    act(() => {
      logCallback({ level: 3, message: '[INFO][webview] [app] After clear' });
    });

    await vi.advanceTimersByTimeAsync(100);
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].message).toBe('After clear');
  });

  it('exposes unique scopes from logs', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 3, message: '[INFO][webview] [app] msg1' });
      logCallback({ level: 3, message: '[INFO][webview] [streaming] msg2' });
      logCallback({ level: 3, message: '[INFO][webview] [plugin:yt] msg3' });
      logCallback({ level: 3, message: '[INFO][webview] [app] msg4' });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.scopes).toEqual(
      expect.arrayContaining(['app', 'streaming', 'yt']),
    );
    expect(result.current.scopes).toHaveLength(3);
  });

  it('filters empty scopes from scopes list', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 3, message: '[INFO][webview] [app] msg1' });
      logCallback({
        level: 2,
        message: '[DEBUG][reqwest::connect] starting connection',
      });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.scopes).toEqual(['app']);
    expect(result.current.scopes).not.toContain('');
  });

  it('exposes unique targets from logs', async () => {
    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({ level: 3, message: '[INFO][webview] [app] msg1' });
      logCallback({
        level: 2,
        message: '[DEBUG][reqwest::connect] starting connection',
      });
      logCallback({
        level: 2,
        message: '[DEBUG][tauri_plugin_updater::updater] checking updates',
      });
      logCallback({ level: 3, message: '[INFO][webview] [streaming] msg2' });
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.targets).toEqual(
      expect.arrayContaining([
        'webview',
        'reqwest::connect',
        'tauri_plugin_updater::updater',
      ]),
    );
    expect(result.current.targets).toHaveLength(3);
  });

  it('preserves logs that arrive during startup log fetch', async () => {
    resetLogStreamForTesting();

    let resolveStartupLogs: (value: unknown) => void;
    vi.mocked(invoke).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStartupLogs = resolve;
        }),
    );

    initLogStream();

    const { result } = renderHook(() => useLogStream());

    await vi.advanceTimersByTimeAsync(0);

    act(() => {
      logCallback({
        level: 3,
        message: '[INFO][webview] [app] Live log during fetch',
      });
    });

    act(() => {
      resolveStartupLogs([
        {
          timestamp: '2026-02-04T10:00:00Z',
          level: 'INFO',
          message: '[INFO][webview] [app] Startup log',
        },
      ]);
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(result.current.logs).toHaveLength(2);
    expect(result.current.logs[0].message).toBe('Startup log');
    expect(result.current.logs[1].message).toBe('Live log during fetch');
  });
});
