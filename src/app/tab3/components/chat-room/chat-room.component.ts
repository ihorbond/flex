import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DbService } from 'src/app/shared/services/db.service';
import { Router } from '@angular/router';
import { first, map, tap, delay } from 'rxjs/operators';
import { ChatRoom } from '../../models/chat-room';
import { environment as env } from 'src/environments/environment';
import { ChatRoomMessage } from '../../models/message';
import { IonTextarea, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Timestamp } from '@firebase/firestore-types';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonTextarea) newMsgTextArea: IonTextarea;
  @ViewChild(IonContent) ionContent: IonContent;

  public messages: ChatRoomMessage[] = [];
  public roomTitle: string;
  public isLoadingOlderMessages: boolean;
  public currUserId = env.testUserId;

  private room: ChatRoom = null;
  private messagesSubscription: Subscription;
  private scrollingElement: HTMLElement;
  private lastDocRef: ChatRoomMessage = null;
  private readonly initialMessageFetchLimit: number = 5;

  constructor(
    private _dbService: DbService,
    private _router: Router
  ) { }

  ngOnInit() {
    //this.currUserId = localStorage.getItem('userId');
    this.room = this._router.getCurrentNavigation().extras.state as ChatRoom;
    console.log("room from router's state " , this.room);
    this.roomTitle = this.getTitle();
    this.loadData();
  }

  ngAfterViewInit(): void {
    //enable scroll events if there is more messages to show than loaded initially
    this.ionContent.scrollEvents = this.room.numOfMessages > this.initialMessageFetchLimit;
    this.ionContent.getScrollElement().then(el => this.scrollingElement = el);
  }

  async ngOnDestroy() {
    this.messagesSubscription.unsubscribe();

    //TODO: give this to bg worker or make part of transaction with newly sent message
    //update room's message count
    await this._dbService.updateAt(`${env.collections.chatRooms}/${this.room.id}`, this.room);
  }

  public scrollHandler(e: any): void {
    const top = this.scrollingElement.scrollTop;
    const height = this.scrollingElement.scrollHeight;
    const offset = this.scrollingElement.offsetHeight;
    //console.log(top, height, offset)

    if (top > height - offset - 1) {
      console.log("bottom");
    }

    if (top === 0 && !this.isLoadingOlderMessages) {
      console.log("top")
      this.loadMoreMessages();
    }
  }

  public showOptions(): void {
    console.log("showOptions");
  }

  public selectImage(): void {
    console.log("selectImage");
  }

  public async sendMessage(): Promise<void> {
    this.room.numOfMessages++;

    const msg: ChatRoomMessage = {
      authorId: this.currUserId,
      text: this.newMsgTextArea.value,
      timestamp: new Date()
    };

    await this._dbService.updateAt(`${env.collections.chatRooms}/${this.room.id}/Messages`, msg);
    this.newMsgTextArea.value = null;
  }

  public getAvatar(msg: ChatRoomMessage): string {
    return this.room.users[msg.authorId].avatar;
  }

  private loadMoreMessages(limit: number = 5): void {
    this.isLoadingOlderMessages = true;
    this._dbService.collection$<ChatRoomMessage>(
      `${env.collections.chatRooms}/${this.room.id}/Messages`,
      ref => ref.orderBy('timestamp', 'desc').startAfter(this.lastDocRef.timestamp as Timestamp).limit(limit)
    ).pipe(
      first(),
      tap(messages => this.lastDocRef = messages[messages.length - 1]),
      map(messages => messages.reverse()),
      delay(1000)
    ).subscribe(messages => {
      if (messages.length === 0) {
        //disable loading older messages when reached limit
        this.ionContent.scrollEvents = false;
      }
      this.messages.unshift(...messages);
      this.isLoadingOlderMessages = false;
    });
  }

  private loadData(): void {
    this.messagesSubscription = this._dbService.collectionStateChanges$<ChatRoomMessage>(
      `${env.collections.chatRooms}/${this.room.id}/Messages`,
      ref => ref.orderBy('timestamp', 'desc').limit(this.initialMessageFetchLimit),
      ['added']
    ).pipe(
      tap(messages => {
        if (!this.lastDocRef && messages.length > 0) this.lastDocRef = messages[messages.length - 1];
        //this.mostRecentDocRef = messages[0];
      }),
      map(messages => messages.reverse())
    ).subscribe(messages => {
      this.messages = this.messages.concat(messages);
      this.ionContent.scrollToBottom();
    });
  }

  private getTitle(): string {
    const id = Object.keys(this.room.users).find(key => key !== this.currUserId);
    return "Chat with " + this.room.users[id].name;
  }

  // public queryFn(ref: CollectionReference): Query<DocumentData> {
  //   return this.mostRecentDocRef 
  //     ? ref.orderBy('timestamp', 'desc').endBefore(this.mostRecentDocRef.timestamp as Timestamp).limit(2) 
  //     : ref.orderBy('timestamp', 'desc').limit(2);
  // }

}
