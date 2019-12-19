import { Event } from 'electron';
import { injectable } from 'inversify';

@injectable()
class UnityControlBar {
  rendererWindow: Event['sender'];

  play() {}
  pause() {}
  render() {}
}

export default UnityControlBar;
