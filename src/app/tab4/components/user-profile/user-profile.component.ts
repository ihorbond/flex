import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { ModalController } from '@ionic/angular';
import { UserProfileEditComponent } from '../user-profile-edit/user-profile-edit.component';
import { DbService } from 'src/app/shared/services/db.service';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public slideOpts = {
    speed: 400,
  };

  public user: User = null;
  private subs: Subscription[] = [];

  constructor(
    private _modalController: ModalController,
    private _dbService: DbService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    const userId = this._authService.currentUser?.id || env.testUserId;
    this.subs.push(this.loadData(userId));
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe());
  }

  public async edit(): Promise<void> {
    const modal = await this._modalController.create({
      component: UserProfileEditComponent,
      swipeToClose: false,
      componentProps: {
        user: cloneDeep(this.user)
      }
    });

    await modal.present();
    
  }

  private loadData(userId: string): Subscription {
    return this._dbService.doc$(`${env.collections.users}/${userId}`).subscribe(doc => {
      console.log(doc);
      this.user = doc; 
    });
   
  }

}
