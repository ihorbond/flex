import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { User } from 'src/app/shared/models/user';
import { EventsService } from 'src/app/tab2/services/events.service';
import { ModalController } from '@ionic/angular';
import { UserProfileEditComponent } from '../user-profile-edit/user-profile-edit.component';

const slideOpts = {
  initialSlide: 1,
  speed: 400
};

const testUserId = "ynlfVJk02V8HnhB82ZH4";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  public user: Partial<User> = null;
  public events = null;

  constructor(
    private _userProfileService: UserProfileService,
    private _eventsService: EventsService,
    private _modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadData(testUserId);
  }

  public async edit(): Promise<void> {
    const modal = await this._modalController.create({
      component: UserProfileEditComponent,
      swipeToClose: false,
      componentProps: {
        user: this.user
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    
  }

  private loadData(userId: string): void {
    this._userProfileService.getProfileById(userId).subscribe(doc => {
      if(doc.exists) {
        this.user = doc.data() as Partial<User>;
        
        console.log(this.user);
      }
      else{
        console.error("No doc");
      }
    });
   
  }

  





}
