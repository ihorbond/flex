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
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.loginForm = this._fb.group({
      username: [null, [Validators.required, Validators.email]],
      pass: [null, [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  public login(e: MouseEvent): void {
    //console.log(e);
    //console.log("login", this.loginForm);
    if(this.loginForm.valid) {
      if(this.loginForm.value['username'] === 'ihor@flexapp.com') {
        localStorage.setItem('userId', 'ynlfVJk02V8HnhB82ZH4')
      }
      else {
        localStorage.setItem('userId', 'k3FGftGYYs69nkzx8g6Y')
      }
      //env.testUserId =  ? 'ynlfVJk02V8HnhB82ZH4' : 'k3FGftGYYs69nkzx8g6Y';
      this._authService.login({...this.loginForm.value})
      .then(userCredentials => {
        console.log(env.testUserId)
        this._router.navigate(['home']);
      }).catch(err => {
        if(this.loginCounter < 5) {
          this.loginCounter++;
          this.loginForm.controls.pass.setValue(null);
          this.presentToast();
        }
        else{

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
