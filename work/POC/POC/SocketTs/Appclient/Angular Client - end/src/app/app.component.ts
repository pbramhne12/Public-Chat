import { flatten } from '@angular/compiler';
import { Component } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Websocket Angular client ';
  userName: string;
  message: string;
  output: any[] = [];
  feedback: string;
  connected: boolean = false;
  participantmessage: any;
  added = false;
  userjoinedmsg: any;
  userLeftMessage: any;
  lastTypingTime: any;
  // Display the welcome message
  Welcomemessage = 'Welcome to Socket.IO Chat';

  messagesList: any[] = [];
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService
      .listen('typing')
      .subscribe((data) => this.updateFeedback(data));
    this.webSocketService
      .listen('chat')
      .subscribe((data) => this.updateMessage(data));

    this.webSocketService.listen('login').subscribe((data) => this.login(data));

    this.webSocketService
      .listen('user joined')
      .subscribe((data) => this.joined(data));

    this.webSocketService
      .listen('user left')
      .subscribe((data) => this.userleft(data));

    this.webSocketService
      .listen('chatHistory')
      .subscribe((data) => this.getchatHistory(data));
  }



  joined(data: any): void {
    this.userjoinedmsg = '';
    this.userjoinedmsg = data.username.username + ' joined';
    this.addParticipantsMessage(data);
  }

  userleft(data: any): void {
    if (data.username.username) {
      this.userLeftMessage = data.username.username + ' left';
      this.lastTypingTime = new Date().toLocaleTimeString();
      this.addParticipantsMessage(data);
    }
  }

  messageTyping(): void {
    this.webSocketService.emit('typing', this.userName);
  }

  sendMessage(): void {
    if (this.userName && this.message) {
      this.webSocketService.emit('chat', {
        message: this.message,
        handle: this.userName,
      });
      this.message = '';
    } else {
      alert('Please enter Username and Message');
    }
  }

  updateMessage(data: any) {
    this.feedback = '';
    if (!!!data) return;
    console.log(`${data.handle} : ${data.message}`);
    this.output.push(data);
  }

  updateFeedback(data: any) {
    this.feedback = `${data} is typing a message`;
  }

  //other Data
  adduser(data: any) {
    // If the username is valid
    this.userName = data;
    console.log(' this.userName in add', this.userName);
    if (this.userName) {
      this.added = true;
      this.webSocketService.emit('add user', {
        username: this.userName,
      });
    }
  }

  login(data: any): void {
    this.connected = true;
    this.userjoinedmsg = '';
    this.userjoinedmsg = this.userName + ' joined';
    this.addParticipantsMessage(data);
  }

  addParticipantsMessage(data) {
    console.log('data in method', data);
    this.participantmessage = '';
    if (data.numUsers === 1) {
      this.participantmessage += "there's 1 participant";
    } else {
      this.participantmessage += 'there are ' + data.numUsers + ' participants';
    }
    console.log(this.participantmessage);
  }

    getchatHistory(data: any): void {
    console.log('Data ---', data);

      this.messagesList.push(data);
      this.output = this.messagesList[0];

    console.log(' this.output ---', this.output);
  }
}
