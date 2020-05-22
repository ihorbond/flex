import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { DbService } from './db.service';
import { environment as env } from 'src/environments/environment';
import { UserDevice } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private _firebaseNative: FirebaseX,
    private _dbService: DbService,
    private _platform: Platform
  ) { }

    public async getToken(): Promise<UserDevice> {
      let token: string;
      if(this._platform.is('android')) {
        token = await this._firebaseNative.getToken();
      }
      
      if(this._platform.is("ios")) {
        token = await this._firebaseNative.getToken();
        await this._firebaseNative.grantPermission();
      }

      console.log("token ", token);
      return this.saveTokenToFirestore(token);
    }

    public listenToNotifications() {
      return this._firebaseNative.onMessageReceived();
    }

    private saveTokenToFirestore(token: string): Promise<any> {
      if(!token) return null;

      const tokenObj = {
        token: token
      };

      return this._dbService.updateAt(`${env.collections.users}/${env.testUserId}/devices`, tokenObj);
    }




}
