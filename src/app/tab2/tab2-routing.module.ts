import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventInfoComponent } from './components/event-info/event-info.component';
import { EventPeopleComponent } from './components/event-people/event-people.component';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
  {
    path: 'detail/:eventId',
    component: EventDetailComponent,
    children: [
      {
        path: 'info',
        component: EventInfoComponent
      },
      {
        path: 'people',
        component: EventPeopleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
