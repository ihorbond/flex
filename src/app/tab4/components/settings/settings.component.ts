import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';

const sm = {
  fb: "https://www.facebook.com/flexeventsapp",
  instagram: "https://www.instagram.com/flexeventsapp",
  reddit: "https://www.reddit.com/flexeventsapp"
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  public flexes: boolean;
  public messages: boolean;
  public eventUpdates: boolean;
  public appVersion: string;

  constructor(
    private _authService: AuthService,
    private _appPreferences: AppPreferences,
    private _iab: InAppBrowser,
    private _appVersion: AppVersion,
    private _appLauncher: AppLauncher
  ) { }

  async ngOnInit() {
    this.setPreferences();
    this.appVersion = "v" + await this._appVersion.getVersionNumber();
  }

  public logout(): void {
    this._authService.logout();
  }

  public onChange(e: any): void {
    this._appPreferences.store('notifications', e.target.name, e.target.checked);
  }

  public openBrowser(url: string): void {
    this._iab.create(url);
  }

  public launchApp(name: string): void {
    switch (name) {
      case 'instagram': {
        const options: AppLauncherOptions = { uri: 'instagram://user?username=flexeventsapp' };
        this._appLauncher.canLaunch(options)
          .then(_ => this._appLauncher.launch(options))
          .catch(_ => this.openBrowser(sm.instagram))
        break;
      }
      case 'fb': {
        const options: AppLauncherOptions = { uri: 'fb://profile/flexeventsapp' };
        this._appLauncher.canLaunch(options)
          .then(_ => this._appLauncher.launch(options))
          .catch(_ => this.openBrowser(sm.fb))
        break;
      }
      case 'reddit': {
        const options: AppLauncherOptions = { uri: 'reddit://' };
        this._appLauncher.canLaunch(options)
          .then(_ => this._appLauncher.launch(options))
          .catch(_ => this.openBrowser(sm.reddit))
        break;
      }
    }
  }

  private async setPreferences(): Promise<void> {
    this.flexes = await this._appPreferences.fetch('notifications', 'flexes');
    this.messages = await this._appPreferences.fetch('notifications', 'messages');
    this.eventUpdates = await this._appPreferences.fetch('notifications', 'eventUpdates');
  }

}
