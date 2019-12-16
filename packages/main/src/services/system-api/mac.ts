import { Event } from 'electron';
import NuclearApi from '../../utils/nuclear-api';

class MacMediaService implements NuclearApi {
  rendererWindow: Event['sender'];

  onPlay() {}
  onPause() {}
  play() {}
  pause() {}
  listen() {}
}

export default MacMediaService;
