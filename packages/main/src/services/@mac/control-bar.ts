import { Event } from 'electron';
import { injectable } from 'inversify';

@injectable()
class MacTouchBar {
  rendererWindow: Event['sender'];

  play() {}
  pause() {}
  render() {}
}

export default MacTouchBar;
