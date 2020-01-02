import { injectable, inject } from "inversify";
import { Menu, app, Tray, nativeImage } from "electron";
import HttpApi from "../http";
import Config from "../config";
import Platform from "../platform";

@injectable()
class TrayMenu {
  private menu: Menu;
  private tray: Tray;

  constructor(
    @inject(Config) private config: Config,
    @inject(HttpApi) private httpApi: HttpApi,
    @inject(Platform) private platform: Platform
  ) {}

  init() {
    this.menu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        type: 'normal',
        click: async () => {
          await this.httpApi.close();

          app.quit();
        }
      }
    ]);

    const icon = nativeImage.createFromPath(
      this.platform.isMac() ? this.config.macIcon : this.config.icon
    );
    this.tray = new Tray(icon);
    this.tray.setTitle(this.config.title);
    this.tray.setToolTip(this.config.title);
    this.tray.setContextMenu(this.menu);
  }
}

export default TrayMenu;
