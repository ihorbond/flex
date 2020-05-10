import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
})
export class UserProfileEditComponent implements OnInit {
  @Input() user: Partial<User>;
  constructor(private _modalController: ModalController) { }

  ngOnInit() {}

  public cancel(): void {
    this._modalController.dismiss(null);
  }

  public save(): void {
    
  }
}
