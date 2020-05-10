import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { User } from 'src/app/shared/models/user';
import { EventsService } from 'src/app/tab2/services/events.service';
import { ModalController } from '@ionic/angular';
import { UserProfileEditComponent } from '../user-profile-edit/user-profile-edit.component';
import { DbService } from 'src/app/shared/services/db.service';
import { Subscription } from 'rxjs';
import { Timestamp } from '@firebase/firestore-types';

const testUserId = "ynlfVJk02V8HnhB82ZH4";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  public user: User = null;
  public events = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private _userProfileService: UserProfileService,
    private _eventsService: EventsService,
    private _modalController: ModalController,
    private _dbService: DbService
  ) { }

  ngOnInit() {
    this.loadData(testUserId);
    //this.subscriptions.push(this.loadData(testUserId));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public async edit(): Promise<void> {
    const modal = await this._modalController.create({
      component: UserProfileEditComponent,
      swipeToClose: false,
      componentProps: {
        user: JSON.parse(JSON.stringify(this.user))
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
  }

  private loadData(userId: string) {
    console.log("loading data");
    return this._dbService.doc$(`Users/${userId}`).subscribe(doc => {

      Object.keys(doc).forEach(key => {
        if(this.isTimeStamp(doc[key])) {
          doc[key] = doc[key].toDate();
          console.log(doc[key]);
        }
      });

      console.log(doc);
      this.user = doc;

    });
   
  }

  private isTimeStamp(obj: Timestamp): obj is Timestamp {
    return (obj as Timestamp).nanoseconds !== undefined;
  }

  





}
