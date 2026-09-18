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
    parser: {
      javascript: {
        exportsPresence: 'warn',
      },
    },
  },
}));
