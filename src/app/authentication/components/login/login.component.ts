import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
//import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginCounter: number = 0;
  public loginForm: FormGroup;

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this._fb.group({
      username: ['oleh@flexapp.com', [Validators.required, Validators.email]],
      pass: ['flexapp', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  public signIn(providerId: string): void {
    console.log("signin in with ", providerId);
    this._authService.signInWithThirdPartyProvider(
      providerId, 
      this.goHome.bind(this), 
      this.showToast.bind(this)
    );
  }

  public async login(e: any) {
    //console.log("login", this.loginForm);
    if (this.loginForm.valid) {
      const loadingEl = await this.showLoading();
      this._authService.login({ ...this.loginForm.value })
        .then(_ => this.goHome())
        .catch(err => {
          this.showToast();
          console.error(err);
          if (this.loginCounter < 5) {
            this.loginCounter++;
            this.loginForm.controls.pass.setValue(null);
          }
          else { }
        })
        .finally(() => loadingEl.dismiss());
    }
  }

  private goHome(): void {
    this._router.navigate(['/tabs']);
  }

  private async showLoading(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: 'Signing in...',
    });
    loading.present();
    return loading;
  }

  private async showToast(): Promise<void> {
    const toast = await this.toastController.create({
      position: 'bottom',
      message: 'Login unsuccessful',
      color: "dark",
      duration: 2000
    });
    toast.present();
  }
}
