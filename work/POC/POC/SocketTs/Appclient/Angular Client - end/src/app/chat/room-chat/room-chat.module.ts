
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomChatRoutingModule } from './room-chat-routing.module';
import{RoomChatComponent} from './room-chat.component'

@NgModule({
  declarations: [
    RoomChatComponent,

  ],
  imports: [
    CommonModule,
    RoomChatRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [RoomChatComponent]
})
export class RoomChatModule { }
