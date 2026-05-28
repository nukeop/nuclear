import type { DomainMeta } from './meta';

export const SettingsAPIMeta: DomainMeta = {
  description: 'Read and write player settings.',
  methods: {
    get: {
      name: 'get',
      description:
        'Get the value of a setting by its namespace-relative ID. The ID is automatically prefixed with the caller namespace.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'SettingValue | undefined',
    },
    set: {
      name: 'set',
      description:
        'Set the value of a setting by its namespace-relative ID. The ID is automatically prefixed with the caller namespace.',
      params: [
        { name: 'id', type: 'string' },
        { name: 'value', type: 'SettingValue' },
      ],
      returns: 'void',
    },
    getGlobal: {
      name: 'getGlobal',
      description: 'Get the value of any setting by its fully qualified ID',
      params: [{ name: 'id', type: 'string' }],
      returns: 'SettingValue | undefined',
    },
    setGlobal: {
      name: 'setGlobal',
      description: 'Set the value of any setting by its fully qualified ID.',
      params: [
        { name: 'id', type: 'string' },
        { name: 'value', type: 'SettingValue' },
      ],
      returns: 'void',
    },
  },
};
