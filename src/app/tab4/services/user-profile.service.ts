import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    public firestore: AngularFirestore
  ) { }

  public getProfileById(userId: string) {
    return this.firestore.collection<User>("Users").doc(userId).get();
  }


}
