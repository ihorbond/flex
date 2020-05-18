import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public flexes: boolean;
  public messages: boolean;
  public eventUpdates: boolean;
  public appVersion: string = "v1.0.0";

  constructor(
    private _authService: AuthService,
    private _appPreferences: AppPreferences,
    private _iab: InAppBrowser,
    private _appVersion: AppVersion
  ) { }

  async ngOnInit() {
    //this.appVersion = "v" + await this._appVersion.getVersionNumber();
  }

  public showAppPreferences(): void {
    this._appPreferences.show();
  }

  public logout(): void {
    this._authService.logout();
  }

  public openBrowser(url: string): void {
    this._iab.create(url);
  }

}
