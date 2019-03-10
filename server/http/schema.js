import settings from '../../app/constants/settings';

export const RESTRICTED_SETTINGS = [];
export const READONLY_SETTINGS = [];

export const getSettingsSchema = {
  params: {
    type: 'object',
    required: ['option'],
    properties: {
      option: {
        type: 'string',
        enum: settings
          .filter(({ name }) => !RESTRICTED_SETTINGS.includes(name))
          .map(({ name }) => name)
      }
    }
  }
};

export const updateSettingsSchema = {
  params: {
    type: 'object',
    required: ['option'],
    properties: {
      option: {
        type: 'string',
        enum: settings
          .filter(({ name }) => !READONLY_SETTINGS.includes(name))
          .filter(({ name }) => !RESTRICTED_SETTINGS.includes(name))
          .map(({ name }) => name)
      }
    }
  },
  body: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {
        type: ['string', 'boolean', 'number']
      }
    }
  }
};

export const volumeSchema = {
  body: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {
        type: 'number',
        minimum: 0,
        maximum: 100
      }
    }
  }
};

export const seekSchema = {
  body: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {
        type: 'number',
        minimum: 0
      }
    }
  }
};
