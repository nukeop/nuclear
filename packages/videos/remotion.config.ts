import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);

Config.overrideBundlerConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

Config.overrideRspackConfig((currentConfiguration) => ({
  ...currentConfiguration,
  module: {
    ...currentConfiguration.module,
    rules: [
      ...(currentConfiguration.module?.rules ?? []),
      {
        test: /\.svg$/i,
        resourceQuery: /react/,
        type: 'javascript/auto',
        loader: '@svgr/webpack',
        options: { svgoConfig: { plugins: ['removeUnusedNS'] } },
      },
    ],
    parser: {
      javascript: {
        exportsPresence: 'warn',
      },
    },
  },
}));
