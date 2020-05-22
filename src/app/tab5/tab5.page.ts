import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/services/fcm.service';
import { tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
// import {
//   Plugins,
//   PushNotification,
//   PushNotificationToken,
//   PushNotificationActionPerformed } from '@capacitor/core';

// const { PushNotifications } = Plugins;

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(
    private _fcmService: FcmService,
    private _toastController: ToastController
  ) { }

  ngOnInit() {

    this._fcmService.getToken();

    this._fcmService.listenToNotifications().subscribe(
      async msg => {
        const toast = await this._toastController.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
      });
  //   PushNotifications.requestPermission().then( result => {
  //     if (result.granted) {
  //       // Register with Apple / Google to receive push via APNS/FCM
  //       PushNotifications.register();
  //     } else {
  //       // Show some error
  //     }
  //   });

  //   // On success, we should be able to receive notifications
  //   PushNotifications.addListener('registration',
  //     (token: PushNotificationToken) => {
  //       alert('Push registration success, token: ' + token.value);
  //     }
  //   );

  //   PushNotifications.addListener('registrationError',
  //   (error: any) => {
  //     alert('Error on registration: ' + JSON.stringify(error));
  //   }
  // );
  }

}
