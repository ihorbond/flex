import { Injectable, OnDestroy } from '@angular/core';
import { UserAuthInfo } from '../models/user-auth-info';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';
import { User } from 'src/app/shared/models/user';
import { of, Subscription } from 'rxjs';
import { auth, firestore } from 'firebase/app';
import { cfaSignInGoogle, cfaSignInFacebook } from 'capacitor-firebase-auth/alternative';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  public loggedInUser: firebase.User = null;

  private userSub: Subscription;

  constructor(
    private _dbService: DbService,
    private _fAuth: AngularFireAuth,
    private _router: Router
  ) {
    // _fAuth.onAuthStateChanged(user => {
    //   console.log("on auth state changed", user);
    //   this.currentUser = user;
    // }, console.error)
    
    this.userSub = _fAuth.authState.subscribe(user => this.loggedInUser = user);
  }

  ngOnDestroy() {
    console.log("auth service destroyed");
    this.userSub.unsubscribe();
  }

  public get fAuth(): AngularFireAuth {
    return this._fAuth;
  }

  public async login(authInfo: UserAuthInfo): Promise<auth.UserCredential> {
    if(authInfo.rememberMe) {
       await this._fAuth.setPersistence(auth.Auth.Persistence.LOCAL)
       console.log("local persistance", true);
    }
    
    const credential = await this._fAuth.signInWithEmailAndPassword(authInfo.username, authInfo.pass);
    console.log("login credential", credential);
    await this.updateUser(credential.user.uid);
    return credential;
  }

  public logout(): void {
    this._fAuth.signOut().then(_ => this._router.navigate(['auth','login']));
  }

  public signInWithThirdPartyProvider(providerId: string, onSuccess: () => void, onError: () => void): void {
    let provider;
    switch (providerId) {
      case "Google": provider = cfaSignInGoogle; break;
      case "Facebook": provider = cfaSignInFacebook; break;
      default: return;
    }

    provider().pipe(first()).subscribe(
      async ({ userCredential, result }) => {
        console.log("credential", userCredential, "result", result);
        if (userCredential) {
          userCredential.additionalUserInfo?.isNewUser
            ? await this.createUser(userCredential.user, result.providerId)
            : await this.updateUser(userCredential.user.uid)
          onSuccess();
        } else {
          onError();
        }
      }, err => {
        console.error(err);
        onError();
      });
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
