import { Component, OnInit, Input } from '@angular/core';
import { User, UserPhoto } from 'src/app/shared/models/user';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';
import { finalize, tap } from 'rxjs/operators';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Observable } from 'rxjs';

//TODO: give photo deletion tasks to background worker

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
})
export class UserProfileEditComponent implements OnInit {
  @Input() user: User;
  public percentage$: Observable<number>;

  private deletedPhotos: UserPhoto[] = [];
  private addedPhotos: UserPhoto[] = [];

  constructor(
    private _modalController: ModalController,
    private _dbService: DbService,
    private _storageService: StorageService,
  ) { }


  ngOnInit() {}

  public cancel(): void {
    // console.log("new photos");
    // console.log(this.addedPhotos)
    this.addedPhotos.forEach(async x => await this.deleteFromServer(x));
    this._modalController.dismiss();
  }

  public async save(): Promise<void> {
    await this._dbService.updateAt(`Users/${this.user.id}`, this.user).then(_ => {
      this._modalController.dismiss();
    }).catch(console.error);

    // console.log("delete photos");
    // console.log(this.deletedPhotos);
    this.deletedPhotos.forEach(async x => await this.deleteFromServer(x));
  }

  public fileChange(files: FileList): void {
    const file: File = files.item(0);
    const name = `${Date.now()}_${file.name}`;
    const path = `images/users/${this.user.id}/${name}`;
    const task = this._storageService.fsRef.upload(path, file);
    this.percentage$ = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(async() => {
        const url = await this._storageService.getDownloadUrl(path);
        const photo = {
          name: name,
          url: url
        };
        (this.user.photos || []).push(photo);
        this.addedPhotos.push(photo);
      })
    ).subscribe();
  }

  public delete(index: number): void {
    const photo = this.user.photos[index];
    this.user.photos.splice(index, 1);
    this.deletedPhotos.push(photo);
  }

  private async deleteFromServer(photo: UserPhoto): Promise<void> {
    const path = `images/users/${this.user.id}/${photo.name}`;
    await this._storageService.delete(path).toPromise().catch(console.error);
  }
}
