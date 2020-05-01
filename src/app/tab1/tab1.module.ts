import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { FeedPostComponent } from './components/feed-post/feed-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [
    Tab1Page, 
    FeedPostComponent,
    NewPostComponent
  ],
  entryComponents: [
    FeedPostComponent,
    NewPostComponent
  ]
})
export class Tab1PageModule {}
