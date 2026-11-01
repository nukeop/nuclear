import once from 'lodash-es/once';
import { compile } from 'tailwindcss';
import tailwindThemeCss from 'tailwindcss/theme.css?raw';
import tailwindUtilitiesCss from 'tailwindcss/utilities.css?raw';
import twAnimateCss from 'tw-animate-css/dist/tw-animate.css?raw';

import runtimeCss from '@nuclearplayer/tailwind-config/runtime.css?raw';
import themeCss from '@nuclearplayer/tailwind-config/theme.css?raw';
import utilitiesCss from '@nuclearplayer/tailwind-config/utilities.css?raw';

const stylesheets: Record<string, string> = {
  'tailwindcss/theme': tailwindThemeCss,
  'tailwindcss/utilities': tailwindUtilitiesCss,
  'tw-animate-css': twAnimateCss,
  './theme.css': themeCss,
  './utilities.css': utilitiesCss,
};

const loadCompiler = once(() =>
  compile(runtimeCss, {
    loadStylesheet: async (id, base) => ({
      path: id,
      base,
      content: stylesheets[id],
    }),
  }),
);

export const compileTailwind = async (classNames: string[]) => {
  const compiler = await loadCompiler();
  return compiler.build(classNames);
};
