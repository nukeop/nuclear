import themeCss from '@nuclearplayer/tailwind-config/theme.css?raw';
import utilitiesCss from '@nuclearplayer/tailwind-config/utilities.css?raw';

const runtimeStylesheet = `@layer theme, base, components, utilities;
@import 'tailwindcss/theme' layer(theme);
@import 'tailwindcss/utilities' layer(utilities);

${themeCss}

${utilitiesCss}`;

export const initTailwindRuntime = async () => {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/tailwindcss');
  style.textContent = runtimeStylesheet;
  document.head.append(style);

  await import('@tailwindcss/browser');
};
