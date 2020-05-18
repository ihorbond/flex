import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab4PageRoutingModule } from './tab4-routing.module';
import { Tab4Page } from './tab4.page';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SharedModule } from '../shared/shared.module';
import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    SharedModule
  ],
  declarations: [Tab4Page, UserProfileComponent, UserProfileEditComponent],
  entryComponents: [UserProfileEditComponent],
  providers: [AppPreferences, InAppBrowser, AppVersion]
})
export class Tab4PageModule {}
