/* eslint-disable @typescript-eslint/no-empty-function */
// This file is here just to make webpac NormalModuleReplacementPlugin works with typescript
import NuclearApi from '../../interfaces/nuclear-api';

class SystemApi implements NuclearApi {
  onPause() {}
  onPlay() {}
  pause() {}
  play() {}

  listen() {}
}

export default SystemApi;

