import { injectable, inject } from 'inversify';
import { Menu, app, Tray, nativeImage } from 'electron';
import { NuclearMeta, IpcEvents} from '@nuclear/core';
import HttpApi from '../http';
import Config from '../config';
import Platform from '../platform';
import Window from '../window';


type PlayerContext = {
  isPlaying?: boolean;
  track?: NuclearMeta
}

@injectable()
class TrayMenu {
  private tray: Tray;

  private playerContext: PlayerContext;

  constructor(
    @inject(Config) private config: Config,
    @inject(HttpApi) private httpApi: HttpApi,
    @inject(Platform) private platform: Platform,
    @inject(Window) private window: Window
  ) { }

  init() {
    const icon = nativeImage.createFromPath(
      this.platform.isMac() ? this.config.macIcon : this.config.icon
    );
    this.tray = new Tray(icon);

    !this.platform.isMac() && this.tray.setTitle(this.config.title);

    this.setPlayerContext({
      isPlaying: false,
      track: null
    });
    this.tray.setToolTip(this.getToolTipString());
    this.tray.setContextMenu(this.getMenu());
  }

  getMenu() {
    const template = [];

    // Playing status
    if (this.playerContext.track) {
      template.push({
        label: `${this.playerContext.isPlaying ? 'Playing - ' : ''}${this.playerContext.track.name}`,
        enabled: false
      });
      template.push({
        label: `by ${this.playerContext.track.artist}`,
        enabled: false
      });
    } else {
      template.push({
        label: '--/--',
        enabled: false
      });
    }
    
    template.push({
      type: 'separator'
    });

    // Control button
    if (this.playerContext.track) {
      if (this.playerContext.isPlaying) {
        template.push({
          label: 'Pause',
          type: 'normal',
          click: async () => {
            this.window.send(IpcEvents.PAUSE);
            this.update({isPlaying: false});
          }
        });
      } else {
        template.push({
          label: 'Play',
          type: 'normal',
          click: async () => {
            this.window.send(IpcEvents.PLAY);
            this.update({isPlaying: true});
          }
        });
      }

      template.push({
        label: 'Next',
        type: 'normal',
        click: async () => {
          this.window.send(IpcEvents.NEXT);
        }
      });

      template.push({
        label: 'Previous',
        type: 'normal',
        click: async () => {
          this.window.send(IpcEvents.PREVIOUS);
        }
      });

      template.push({
        type: 'separator'
      });
    }

    // Quit button
    template.push({
      label: 'Quit',
      type: 'normal',
      click: async () => {
        await this.httpApi.close();

        app.quit();
      }
    });

    return Menu.buildFromTemplate(template);
  }

  getToolTipString() {
    return this.playerContext.track ? 
      `${this.playerContext.isPlaying ? 'Playing: ' : ''} ${this.playerContext.track.name} - ${this.playerContext.track.artist}` :
      this.config.title ;
  }

  setPlayerContext(playerContext: PlayerContext) {
    this.playerContext = {
      ...this.playerContext,
      ...playerContext
    };
  }

  update(newPlayerContext?: PlayerContext) {
    if (newPlayerContext) {
      this.setPlayerContext(newPlayerContext);
    }

    this.tray.setContextMenu(this.getMenu());
    this.tray.setToolTip(this.getToolTipString());
  }
}

export default TrayMenu;
