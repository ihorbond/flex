import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';

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
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this._fb.group({
      username: ['ihor@flexapp.com', [Validators.required, Validators.email]],
      pass: ['flexapp', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  public async login(e: MouseEvent) {
    //console.log(e);
    //console.log("login", this.loginForm);
    if (this.loginForm.valid) {
      const userId = this.loginForm.value['username'] === 'ihor@flexapp.com'
        ? 'ynlfVJk02V8HnhB82ZH4'
        : 'k3FGftGYYs69nkzx8g6Y';
      localStorage.setItem('userId', userId);

      this._authService.login({ ...this.loginForm.value })
        .then(credentials => {
          this._router.navigate(['/tabs']);
        }).catch(err => {
          if (this.loginCounter < 5) {
            this.loginCounter++;
            this.loginForm.controls.pass.setValue(null);
            this.presentToast();
          }
          else {

          }
        });
    }
  }

  private async presentToast(): Promise<void> {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Invalid username or password',
      color: "warning",
      duration: 1500
    });
    toast.present();
  }
}
