import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { DbService } from './db.service';
import { environment as env } from 'src/environments/environment';
import { UserDevice } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { Device } from '@ionic-native/device/ngx';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseNativeService {

  private userId: string;

  constructor(
    private _firebaseNative: FirebaseX,
    private _dbService: DbService,
    private _platform: Platform,
    private _device: Device,
    private _authService: AuthService
  ) {
      this.userId = this._authService.currentUser?.id || env.testUserId;
    // this._firebaseNative.onTokenRefresh().subscribe(newToken => {

    //   this.saveToFirestore(newToken);
    // });
  }

  public async saveDevice(): Promise<void> {
    const token: string = await this._firebaseNative.getToken();
    const hasPermission = await this._firebaseNative.hasPermission() || await this._firebaseNative.grantPermission();
    console.log("has perm ", hasPermission);

    if(hasPermission) {
      this._dbService.collection$<UserDevice>(`Users/${this.userId}/Devices`, ref => ref.where('token', '==', token))
      .pipe(first())
      .subscribe(tokens => {
        const isDuplicate = tokens.some(x => x.token === token);
        console.log("Looking for duplicates", this.userId, tokens, isDuplicate);
        if (!isDuplicate)
          return this.saveToFirestore(token);
      });
    }

    // if(this._platform.is("ios")) {}
  }

  public listenToNotifications(): Observable<any> {
    return this._firebaseNative.onMessageReceived();
  }

  public async checkPermission(): Promise<boolean> {
    return await this._firebaseNative.hasPermission();
  }

  private saveToFirestore(token: string): Promise<any> {
    if (!token) return null;

    const device: UserDevice = {
      manufacturer: this._device.manufacturer,
      model: this._device.model,
      version: this._device.version,
      uuid: this._device.uuid,
      token: token
    };

    return this._dbService.updateAt(`${env.collections.users}/${this.userId}/Devices`, device);
  }

}
