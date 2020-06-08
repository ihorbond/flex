import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import { DbService } from '../shared/services/db.service';
import { environment as env } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Timestamp } from '@firebase/firestore-types';
import { Notification } from '../shared/models/notification';
import * as moment from 'moment';
import { AuthService } from '../authentication/services/auth.service';

const formats = {
  sameDay: 'h:mm A',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'MM/DD/YY'
}

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit, OnDestroy {

  public notifications: Notification[] = null;

  private notificationFetchLimit: number = 10;
  private notificationSub: Subscription;
  private userId: string;

  constructor(
    private _dbService: DbService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = this._authService.loggedInUser?.uid || env.testUserId;
    this.subscribeToNotifications();
  }

  ngOnDestroy(): void {
    this.notificationSub.unsubscribe();
  }

  public delete(idx: number): void {
    const notification = this.notifications[idx];
    console.log("deleting notification", notification);
    this.notifications.splice(idx, 1);
    this._dbService.delete(`${env.collections.users}/${this.userId}/Notifications/${notification.id}`);
  }

  public timeToNow(timestamp: Timestamp): string {
    return moment(timestamp.toDate()).calendar(null, formats);
  }

  public loadMore(e: any): void {
    this.notificationFetchLimit += 10;
    this.subscribeToNotifications(e);
  }

  private subscribeToNotifications(e?: any): void {
    if (this.notificationSub)
      this.notificationSub.unsubscribe();

    this.notificationSub = this._dbService.collection$<Notification>(
      `${env.collections.users}/${this.userId}/Notifications`,
      ref => ref.orderBy('timestamp', 'desc').limit(this.notificationFetchLimit))
      .pipe(delay(1000))
      .subscribe((notifications: Notification[]) => {
        console.log(this.userId, notifications);
        const prevCount = (this.notifications || []).length;
        this.notifications = notifications;

        if (e) {
          e.target.complete();
          e.target.disabled = prevCount === this.notifications.length;
        }
      }, console.error);
  }

}
