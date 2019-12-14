import { Event } from 'electron';
import NuclearApi from '../../utils/api';

class TouchBar implements NuclearApi {
  rendererWindow: Event['sender'];

  onPlay() {}
  onPause() {}
  play() {}
  pause() {}
  listen() {}
}

export default TouchBar;
