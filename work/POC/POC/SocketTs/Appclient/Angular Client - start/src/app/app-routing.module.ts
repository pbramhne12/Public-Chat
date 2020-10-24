import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';

const routes: Routes = [
  { path: '', component: AppComponent },

  { path: 'privatechat', component: PrivateChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
