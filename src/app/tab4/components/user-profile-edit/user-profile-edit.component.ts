import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
})
export class UserProfileEditComponent implements OnInit {
  @Input() user: User;
  constructor(
    private _modalController: ModalController,
    private _dbService: DbService
  ) { }

  ngOnInit() {
  }

  public cancel(): void {
    this._modalController.dismiss(null);
  }

  public save(): void {
    this._dbService.updateAt(`Users/${this.user.id}`, this.user).then(_ => {
      this._modalController.dismiss(this.user);
    }).catch(err => {
      console.error(JSON.stringify(err));
    });
    
  }
}
