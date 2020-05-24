import { Component, OnInit } from '@angular/core';
import { FirebaseNativeService } from '../shared/services/firebase-native.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  private notificationSub: Subscription;

  constructor(
    private _firebaseNative: FirebaseNativeService,
    private _router: Router
  ) {}

  ngOnInit() {
    console.log("tabs entered");
    this._firebaseNative.saveDevice();

    this.notificationSub = this._firebaseNative.listenToNotifications().subscribe(ntf => {
      console.log("notification", ntf);
      this._router.navigate(['tabs', 'notifications']);
      console.log("tap from ", ntf.tap);
    });
  }

  ngOnDestory() {
    console.log("tabs destroyed");
    this.notificationSub.unsubscribe();
  }

}
