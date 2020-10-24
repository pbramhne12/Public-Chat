import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomChatComponent } from './room-chat.component';

const routes: Routes = [
  {
    path: '',
    component: RoomChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomChatRoutingModule {}
