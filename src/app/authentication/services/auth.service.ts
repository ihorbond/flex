import { Injectable } from '@angular/core';
import { UserAuthInfo } from '../models/user-auth-info';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User = null;

  constructor(
    private fAuth: AngularFireAuth,
    private _router: Router) {
    fAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  public login(authInfo: UserAuthInfo): Promise<firebase.auth.UserCredential> {
    return this.fAuth.auth.signInWithEmailAndPassword(authInfo.username, authInfo.pass);
  }

  public logout(): void {
    this.fAuth.auth.signOut().then(_ => this._router.navigate(['/auth/login']));
  }
  
}
