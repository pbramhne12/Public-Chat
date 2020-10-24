import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'login', loadChildren: () => import('./login/login/login.module').then((m) => m.LoginModule) },
  // { path: 'chatwindow', loadChildren: () => import('./chat/room-chat/room-chat.module').then((m) => m.RoomChatModule) },
  { path: '',component:AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
