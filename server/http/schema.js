import settings from '../../common/settings';

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

export const addPlaylistSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        maxLength: 100
      }
    }
  }
};

export const deletePlaylistSchema = {
  params: {
    type: 'object',
    required: ['option'],
    properties: {
      name: {
        type: 'string'
      }
    }
  }
};

export const setEqualizerSchema = {
  params: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string'
      }
    }
  }
};

export const updateEqualizerSchema = {
  body: {
    required: ['values'],
    properties: {
      values: {
        type: 'array',
        minItems: 10,
        maxItems: 10,
        items: [{ type: 'number' }]
      }
    }
  }
};
