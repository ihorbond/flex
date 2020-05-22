import { Injectable } from '@angular/core';
//import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { DbService } from './db.service';
import { environment as env } from 'src/environments/environment';
import { UserDevice } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
   //private _firebaseNative: Firebase,
    private _dbService: DbService,
    private _platform: Platform
  ) { }

    // public async getToken(): Promise<UserDevice> {
    //   let token: string;
    //   if(this._platform.is('android')) {
    //     token = await this._firebaseNative.getToken();
    //   }
      
    //   if(this._platform.is("ios")) {
    //     token = await this._firebaseNative.getToken();
    //     await this._firebaseNative.grantPermission();
    //   }

    //   return this.saveTokenToFirestore(token);
    // }

    // public listenToNotifications() {
    //   return this._firebaseNative.onNotificationOpen();
    // }

    // private saveTokenToFirestore(token: string): Promise<any> {
    //   if(!token) return null;

    //   const tokenObj = {
    //     token: token
    //   };

    //   return this._dbService.updateAt(`${env.collections.users}/${env.testUserId}/devices`, tokenObj);
    // }




}
