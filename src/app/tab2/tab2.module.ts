import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventPeopleComponent } from './components/event-people/event-people.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventInfoComponent } from './components/event-info/event-info.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [
    Tab2Page, 
    EventCardComponent,
    EventDetailComponent,
    EventPeopleComponent,
    EventInfoComponent
  ]
})
export class Tab2PageModule {}
