import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

import { applyAdvancedTheme, setThemeId } from '@nuclearplayer/themes';

import { useThemeStore } from '../stores/themeStore';

export async function isMatugenAvailable(): Promise<boolean> {
  try {
    return await invoke<boolean>('is_matugen_available');
  } catch {
    return false;
  }
}

export async function getMatugenCssPath(): Promise<string> {
  return await invoke<string>('get_matugen_css_path');
}

export async function readMatugenCss(): Promise<string> {
  return await invoke<string>('read_matugen_css');
}

export async function checkMatugenAvailability(): Promise<boolean> {
  const available = await isMatugenAvailable();
  useThemeStore.getState().setMatugenAvailable(available);
  return available;
}

export async function matugenCssExists(): Promise<boolean> {
  try {
    console.log('[Matugen] Checking if CSS exists...');
    await readMatugenCss();
    console.log('[Matugen] CSS file found');
    return true;
  } catch (err) {
    console.log('[Matugen] CSS file not found or error:', err);
    return false;
  }
}

export async function applyMatugenTheme(): Promise<void> {
  try {
    console.log('[Matugen] Reading CSS...');
    const cssContent = await readMatugenCss();
    console.log('[Matugen] CSS content length:', cssContent.length);

    const { vars, dark } = parseCssToTheme(cssContent);
    console.log('[Matugen] Parsed vars:', Object.keys(vars).length);
    console.log('[Matugen] Parsed dark:', Object.keys(dark).length);

    const themeContent = {
      version: 1 as const,
      name: 'Matugen',
      vars,
      dark,
    };
    console.log('[Matugen] Applying theme...');

    setThemeId('');
    applyAdvancedTheme(themeContent);
    console.log('[Matugen] Theme applied successfully');

    useThemeStore.getState().setMatugenEnabled(true);
  } catch (error) {
    console.error('[Matugen] Error applying theme:', error);
    toast.error("Couldn't apply matugen theme", {
      description: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function disableMatugenTheme(): Promise<void> {
  useThemeStore.getState().setMatugenEnabled(false);
}

function parseCssToTheme(cssContent: string): {
  vars: Record<string, string>;
  dark: Record<string, string>;
} {
  const vars: Record<string, string> = {};
  const dark: Record<string, string> = {};
  let darkMode = false;

  const lines = cssContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.includes('[data-theme=')) {
      darkMode = trimmed.includes('dark');
      continue;
    }

    if (trimmed === '}' || trimmed === '*/') {
      continue;
    }

    if (trimmed.startsWith('/*')) {
      continue;
    }

    if (trimmed.startsWith('@')) {
      continue;
    }

    const match = trimmed.match(/^--([\w-]+):\s*([^;]+);?$/);
    if (match) {
      const [, property, value] = match;
      const cleanValue = value.trim().replace(/;$/, '').trim();

      if (darkMode) {
        dark[property] = cleanValue;
      } else {
        vars[property] = cleanValue;
      }
    }
  }

  return { vars, dark };
}
