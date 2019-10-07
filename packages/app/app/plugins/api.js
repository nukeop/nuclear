// Nuclear plugin API, which defines the functionality exposed to plugins
import electron from 'electron';

export default () => ({
  app: electron.remote.app
});
