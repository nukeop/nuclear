// This file is here just to make webpac NormalModuleReplacementPlugin works with typescript
import NuclearApi from '../../utils/nuclear-api';
import { Event } from 'electron';

class SystemApi implements NuclearApi {
  rendererWindow: Event['sender'];

  onPause() {}
  onPlay() {}
  pause() {}
  play() {}

  listen() {}
}

export default SystemApi;

