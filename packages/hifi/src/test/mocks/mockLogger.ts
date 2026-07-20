import { LoggerProvider } from '../../LoggerProvider';

export function initMockLogger(): void {
  LoggerProvider.init({
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });
}
