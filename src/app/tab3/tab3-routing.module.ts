import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
  },
  {
    path: ':id',
    component: ChatRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
