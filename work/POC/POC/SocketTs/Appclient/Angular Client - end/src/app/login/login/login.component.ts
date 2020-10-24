import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: string;
  added = false;

  constructor(
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (window.sessionStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/chatwindow');
    }

  }

  //other Data
  addInput(data: any) {
    // If the username is valid
    this.userName = data;
    console.log(' this.userName in add', this.userName);
    if (this.userName) {
      this.added = true;
      this.webSocketService.emit('add user', {
        username: this.userName,
      });

      sessionStorage.setItem('currentUser', this.userName);
      if (window.sessionStorage.getItem('currentUser')) {
        this.router.navigateByUrl('/chatwindow');
      }
    }
  }
}
