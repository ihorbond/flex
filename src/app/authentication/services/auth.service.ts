import { Injectable, OnDestroy } from '@angular/core';
import { UserAuthInfo } from '../models/user-auth-info';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';
import { User } from 'src/app/shared/models/user';
import { of, Subscription } from 'rxjs';
import { auth, firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  public currentUser: User = null;

  private userSub: Subscription;

  constructor(
    private _dbService: DbService,
    private _fAuth: AngularFireAuth,
    private _router: Router) {
    this.userSub = _fAuth.authState.pipe(
      switchMap(user => user ? this._dbService.doc$(`Users/${user.uid}`) : of(null))
    ).subscribe(user => this.currentUser = user);
  }

  ngOnDestroy() {
    console.log("auth service destroyed");
    this.userSub.unsubscribe();
  }

  public get fAuth(): AngularFireAuth {
    return this._fAuth;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  public async login(authInfo: UserAuthInfo): Promise<auth.UserCredential> {
    const credential = await this._fAuth.signInWithEmailAndPassword(authInfo.username, authInfo.pass);
    await this.updateUser(credential.user.uid);
    return credential;
  }

  public logout(): void {
    this._fAuth.signOut().then(_ => this._router.parseUrl('/auth/login'));
  }

  public signInWithThirdPartyProvider(providerId: string): Promise<auth.UserCredential> {
    let provider: auth.AuthProvider;
    switch(providerId) {
      case "Facebook": provider = new auth.FacebookAuthProvider(); break;
      case "Google": provider = new auth.GoogleAuthProvider(); break;
    }
    return this.signInWithPopup(provider);
  }

  private async signInWithPopup(provider: auth.AuthProvider): Promise<auth.UserCredential> {
    const credential = await this._fAuth.signInWithPopup(provider);
    console.log("credential", credential);
    if(credential) {
       credential.additionalUserInfo.isNewUser 
        ? await this.createUser(credential.user, credential.additionalUserInfo.providerId) 
        : await this.updateUser(credential.user.uid)
        return credential;
    }
    return Promise.reject("Invalid credentials");
  }

  private updateUser(id: string): Promise<User> {
    const timestamp = firestore.Timestamp.fromDate(new Date());
    const data: Partial<User> = {
      lastSignIn: timestamp,
      updatedAt: timestamp
    };

    return this._dbService.updateAt(`Users/${id}`, data);
  }

  private createUser(user: firebase.User, providerId?: string): Promise<User> {
    const name = user.displayName.split(' ');
    const timestamp = firestore.Timestamp.fromDate(new Date());
    const data: Partial<User> = {
      id: user.uid,
      signInProviderId: providerId || user.providerId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: name[0],
      lastName: name[1],
      lastSignIn: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      avatar: {
        name: user.displayName,
        url: user.photoURL
      },
    }

    return this._dbService.updateAt(`Users/${data.id}`, data);
  }

}
