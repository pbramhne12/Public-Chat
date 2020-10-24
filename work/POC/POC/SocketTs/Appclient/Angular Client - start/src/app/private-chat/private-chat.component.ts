import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent implements OnInit {
  @Input() userList: any[];

  @Input() PrivatemessageList: any[];

  @Output() destroy = new EventEmitter<object>();

  // userList: any[] = [];
  // PrivatemessageList: any[] = [];
  message: string;
  selectedUser: any = null;
  username: any;

  // currentUser = window.sessionStorage.getItem('currentUser');
  currentUser = localStorage.getItem('currentUser');


  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    console.log('userList in private space', this.userList);

    // this.webSocketService
    //   .listen('sendMsg')
    //   .subscribe((data) => this.outputMessage(data));
  }

  outputMessage(data: any): void {
    this.PrivatemessageList.push(data);
    console.log('this.PrivatemessageList', this.PrivatemessageList);
  }

  selectedItem:any;

  SelectPrivateChat(event: any, user: any) {
    this.selectedUser = user.id;
    this.selectedItem = user;
  }

  submitPC(message: any) {
    if (this.selectedUser) {
      this.webSocketService.emit('getMsg', {
        toid: this.selectedUser,
        msg: message,
        // name: window.sessionStorage.getItem('currentUser'),
        name:localStorage.getItem('currentUser')
      });
    } else {
      this.selectedUser = null;
    }
    this.message = '';
  }

  destroyCamapignDetailView() {
    this.destroy.emit(null);
  }
}
