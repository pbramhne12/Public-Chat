import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  room = 'Room1';

  roomName: any;
  userList: any[] = [];
  messageList: any[] = [];

  newCampaignClicked = null;
  vindex = 1;
  VCampaign: any;
  HistoryMessagesList: any[] = [];

  currentUser: any;
  currentRoom: any;
  constructor(private webSocketService: WebSocketService,private router:Router) {
    // this.currentUser = window.sessionStorage.getItem('currentUser');
    // this.currentRoom = sessionStorage.getItem('currentRoom');
    this.currentUser = localStorage.getItem('currentUser');
    this.currentRoom = localStorage.getItem('currentRoom');

  }

  ngOnInit(): void {
    console.log(this.userList.length);
    console.log(
      'C you have been reconnected' + this.currentUser + this.currentRoom
    );

    if (this.currentUser && this.currentRoom) {

      this.reconnect();
    }

    this.webSocketService
      .listen('message')
      .subscribe((data) => this.outputMessage(data));

    this.webSocketService
      .listen('roomUsers')
      .subscribe((data) => this.outputData(data));

    this.webSocketService
      .listen('chatHistory')
      .subscribe((data) => this.getchatHistory(data));

    // Whenever the server emits 'typing', show the typing message
    this.webSocketService
      .listen('typing')
      .subscribe((data) => this.updateFeedback(data));

    // Whenever the server emits 'stop typing', kill the typing message
    this.webSocketService
      .listen('stop typing')
      .subscribe((data) => this.removeChatTyping(data));

    this.webSocketService
      .listen('sendMsg')
      .subscribe((data) => this.outputPrivateChats(data));


  }

  PrivatemessageList: any = [];

  outputPrivateChats(data) {
    this.PrivatemessageList.push(data);
  }

  joinChat(username) {
    console.log({ username: username, room: this.room });

    localStorage.setItem('currentUser', username);

    this.webSocketService.emit('joinRoom', {
      username: username,
      room: this.room,
    });
  }

  outputData(data: any) {
    this.outputRoomName(data.room);
    this.outputUsers(data.users);
  }

  // Add room name to DOM
  outputRoomName(room) {
    this.roomName = room;

    localStorage.setItem('currentRoom', room);

    console.log('this.roomName ', this.roomName);
  }

  // Add users to DOM
  outputUsers(users) {
    this.userList = users;
    console.log('users List', this.userList);
  }

  // Output message to DOM
  outputMessage(message) {
    this.messageList.push(message);

    this.currentUser = localStorage.getItem('currentUser');
  }

  submit(msg: any) {
    if (!msg) {
      return false;
    }
    // Emit message to server
    this.webSocketService.emit('chatMessage', msg);
    this.message = '';
  }

  typing = false;
  lastTypingTime: any;
  TYPING_TIMER_LENGTH = 400; // ms

  messageTyping(): void {
    if (!this.typing) {
      this.typing = true;
      this.webSocketService.emit('typing', {});
    }

    this.lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let typingTimer = new Date().getTime();
      let timeDiff = typingTimer - this.lastTypingTime;
      if (timeDiff >= this.TYPING_TIMER_LENGTH && this.typing) {
        this.webSocketService.emit('stop typing', {});
        this.typing = false;
      }
    }, this.TYPING_TIMER_LENGTH);

    // this.userName = window.sessionStorage.getItem('currentUser');
  }

  // Removes the visual chat typing message
  removeChatTyping(data) {
    this.feedback = '';
  }

  //showing the User Is Typing msg
  updateFeedback(data: any) {
    this.feedback = `${data.username} is typing a message`;
  }

  getchatHistory(data: any): void {
    console.log('Data ---', data);

    if (this.HistoryMessagesList.length > 0) {
      this.HistoryMessagesList.push(data);
      this.messageList = data;
    } else {
      this.HistoryMessagesList = [];
    }

    console.log(' this.output ---', this.output);
  }

  leaveRoom() {
    localStorage.clear();
  }
  //for Private Chats Only
  OpenPrivateChat() {
    this.userList = this.userList;
    this.newCampaignClicked = 'opened';
  }

  closePrivateChat() {
    this.newCampaignClicked = null;
  }

  //If use wants to reconnect he can reconnect again
  reconnect() {
    console.log(
      'you have been reconnected ' + this.currentUser + this.currentRoom
    );

    if (this.currentUser && this.currentRoom) {
      this.webSocketService.emit('joinRoom', {
        username: this.currentUser,
        room: this.currentRoom,
      });
    }
    this.router.navigate([""])

  }
}
