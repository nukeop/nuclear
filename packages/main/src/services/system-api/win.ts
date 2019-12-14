import NuclearApi from '../../utils/api';
import { Event } from 'electron';

class TaskBar implements NuclearApi {
  rendererWindow: Event['sender'];

  onPlay() {}
  onPause() {}
  play() {}
  pause() {}
  listen() {}
}

export default TaskBar;
