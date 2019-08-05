const register = require('ignore-styles').default;

register(['.css', '.scss']);
register(undefined, (module, filename) => {
  if (['.png', '.jpg'].some(ext => filename.endsWith(ext))) {
    module.exports = 'IMAGE_MOCK';
  }
});
