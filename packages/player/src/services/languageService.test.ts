import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyLanguageFromSettings,
  changeLanguage,
  initLanguageWatcher,
} from './languageService';

const { getMock, subscribeMock, changeLanguageMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  subscribeMock: vi.fn(),
  changeLanguageMock: vi.fn(async () => undefined),
}));

vi.mock('@nuclearplayer/i18n', () => ({
  i18n: {
    changeLanguage: changeLanguageMock,
  },
}));

vi.mock('./settingsHost', () => ({
  coreSettingsHost: {
    get: getMock,
    subscribe: subscribeMock,
  },
}));

describe('languageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.dir = '';
    document.documentElement.lang = '';
  });

  it('sets rtl direction and BCP-47 lang for he_IL', async () => {
    await changeLanguage('he_IL');

    expect(changeLanguageMock).toHaveBeenCalledWith('he_IL');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('he-IL');
  });

  it('sets ltr direction and BCP-47 lang for non-RTL locale', async () => {
    await changeLanguage('pt_BR');

    expect(changeLanguageMock).toHaveBeenCalledWith('pt_BR');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('updates dir/lang when switching between locales', async () => {
    await changeLanguage('he_IL');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('he-IL');

    await changeLanguage('en_US');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en-US');
  });

  it('normalizes locales with multiple underscores to valid lang tags', async () => {
    await changeLanguage('zh_Hans_CN');

    expect(document.documentElement.lang).toBe('zh-Hans-CN');
  });

  it('applies saved language from settings when available', async () => {
    getMock.mockResolvedValueOnce('he_IL');

    await applyLanguageFromSettings();

    expect(getMock).toHaveBeenCalledWith('general.language');
    expect(changeLanguageMock).toHaveBeenCalledWith('he_IL');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('he-IL');
  });

  it('ignores non-string saved values', async () => {
    getMock.mockResolvedValueOnce(true);

    await applyLanguageFromSettings();

    expect(changeLanguageMock).not.toHaveBeenCalled();
  });

  it('subscribes to language changes and applies only string values', async () => {
    const listenerCallbacks: Array<(value: unknown) => void> = [];
    subscribeMock.mockImplementation(
      (_id: string, listener: (value: unknown) => void) => {
        listenerCallbacks.push(listener);
        return () => undefined;
      },
    );

    initLanguageWatcher();

    expect(subscribeMock).toHaveBeenCalledWith(
      'general.language',
      expect.any(Function),
    );

    listenerCallbacks[0]?.('he_IL');
    await Promise.resolve();

    expect(changeLanguageMock).toHaveBeenCalledWith('he_IL');
    expect(document.documentElement.dir).toBe('rtl');

    listenerCallbacks[0]?.(123);
    await Promise.resolve();

    expect(changeLanguageMock).toHaveBeenCalledTimes(1);
  });
});
