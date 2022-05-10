import { IpcEvents } from '@nuclear/core';
import { nativeImage, TouchBar } from 'electron';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import path from 'path';
import { isProd } from '../../utils/env';

import Platform from '../platform';
import Store from '../store';
import Window from '../window';

const { TouchBarButton, TouchBarSlider } = TouchBar;

const iconBasePath = isProd ? path.join(__dirname, '../../../resources/media/touchbar') : path.join(__dirname, '../resources/media/touchbar');
const touchbarIcons = ({
  logo: nativeImage.createFromPath(path.join(iconBasePath, 'icon.png')),
  play: nativeImage.createFromPath(path.join(iconBasePath, 'play.png')),
  pause: nativeImage.createFromPath(path.join(iconBasePath, 'pause.png')),
  backward: nativeImage.createFromPath(path.join(iconBasePath, 'step-backward.png')),
  forward: nativeImage.createFromPath(path.join(iconBasePath, 'step-forward.png'))
});

@injectable()
class TouchbarMenu {
    private touchbar: TouchBar;
    constructor(
        @inject(Platform) private platform: Platform,
        @inject(Store) private store: Store,
        @inject(Window) private window: Window
    ) { }

    init() {
      if (this.platform.isMac()) {
        const logo = new TouchBarButton({
          icon: touchbarIcons.logo,
          backgroundColor: '#000000'
        });
        const playButton = new TouchBarButton({
          icon: touchbarIcons.play,
          click: () => this.window.send(IpcEvents.PLAY)
        });
        const pauseButton = new TouchBarButton({
          icon: touchbarIcons.pause,
          click: () => this.window.send(IpcEvents.PAUSE)
        });
        const backwardButton = new TouchBarButton({
          icon: touchbarIcons.backward,
          click: () => this.window.send(IpcEvents.PREVIOUS)
        });
        const forwardButton = new TouchBarButton({
          icon: touchbarIcons.forward,
          click: () => this.window.send(IpcEvents.NEXT)
        });
        const volumeSlider = new TouchBarSlider({
          label: 'Volume',
          minValue: 0,
          maxValue: 100,
          value: this.store.getOption('volume'),
          change: _.debounce((value) => this.window.send(IpcEvents.VOLUME, value), 500)
        });
        this.touchbar = new TouchBar({
          items: [
            logo, 
            backwardButton, playButton, pauseButton, forwardButton,
            volumeSlider
          ]
        });
        this.window.getBrowserWindow().setTouchBar(this.touchbar);
      }
    }
}

export default TouchbarMenu;
