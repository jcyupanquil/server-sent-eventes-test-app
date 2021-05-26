import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from './model/message.model';
import { Participant } from './model/participant.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'server-sent-event-test-app';

  urlBase: string = 'http://localhost:9090/notifications/v0';


  connected: boolean = false;

  createdMessage: Message = new Message();
  messages: Message[] = [];
  // writingMessage: string;
  clientId: string;

  conversationId: string = '60aca13b880c85012ce89f9f';

  eventSource: EventSource = null;

  constructor(private http: HttpClient) {

    this.createdMessage.sender = new Participant();
    this.createdMessage.sender.participantId = 1;

    this.eventSource = new EventSource(this.urlBase + '/subscribe?conversation-id=' + this.conversationId);

    this.eventSource.addEventListener('NEW_MESSAGE', event => {
      let message: Message = (JSON.parse((event as MessageEvent).data) as Message);
      this.messages.push(message);
      // console.log(this.messages);
      // console.log(message);
    });

    this.eventSource.addEventListener('error', event => {
      if ((event.currentTarget as EventSource).readyState !== EventSource.prototype.CLOSED) {
        // this.eventSource.close();
      }
    });

  }

  ngOnInit() {
    this.getHistory();
  }

  ngOnDestroy() {
    this.eventSource.close();
  }

  getHistory(): void {
    this.http.get<Message[]>(this.urlBase + '/conversations/' + this.conversationId + '/messages')
      .subscribe(messagesHitory => this.messages = messagesHitory);
  }

  sendMessage(): void {
    this.createdMessage.type = 'MESSAGE';
    this.http.post(this.urlBase + '/conversations/' + this.conversationId + '/messages', this.createdMessage)
      .subscribe();

    this.createdMessage.content = '';
  }
}
