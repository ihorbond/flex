import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Query } from '@angular/core';
import { DbService } from 'src/app/shared/services/db.service';
import { Router } from '@angular/router';
import { first, map, tap, delay } from 'rxjs/operators';
import { ChatRoom } from '../../models/chat-room';
import { environment as env } from 'src/environments/environment';
import { ChatRoomMessage } from '../../models/message';
import { IonTextarea, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';
import { Transaction } from '@firebase/firestore-types';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonTextarea) newMsgTextArea: IonTextarea;
  @ViewChild(IonContent) ionContent: IonContent;

  public messages: ChatRoomMessage[] = [];
  public isLoadingOlderMessages: boolean;
  public readonly currUserId = env.testUserId;

  private room: ChatRoom = null;
  private messagesSub: Subscription;
  private scrollElement: HTMLElement;
  private lastDocRef: ChatRoomMessage = null;
  private readonly msgFetchLimit: number = 10;
  private lastScrollHeight: number = 0;
  private otherUserId: string;

  constructor(
    private _dbService: DbService,
    private _router: Router
  ) { }

  ngOnInit() {
    //this.currUserId = localStorage.getItem('userId');
    this.room = this._router.getCurrentNavigation().extras.state as ChatRoom;
    this.otherUserId = Object.keys(this.room.users).find(key => key !== this.currUserId);
    console.log("room from router's state ", this.room);
    this.updateRoom();
    this.subscribeToMessages();
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then(el => this.scrollElement = el);
    this.toggleScrollEvents(this.room.msgCount > this.msgFetchLimit);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();

    //TODO: give this to bg worker or make part of transaction with newly sent message
    this._dbService.fs.collection(env.collections.chatRooms)
      .doc<ChatRoom>(this.room.id)
      .update({ [`users.${this.otherUserId}.isInTheRoom`]: false });
  }

  private updateRoom(): void {
    const currUser = this.room.users[this.currUserId];
    if (currUser.unreadMsgCount > 0) {
      currUser.unreadMsgCount = 0;
    }
    currUser.isInTheRoom = true;
    const path = `${env.collections.chatRooms}/${this.room.id}`;
    this._dbService.updateAt(path, this.room).catch(console.error);
  }

  public get roomTitle(): string {
    return "Chat with " + this.room.users[this.otherUserId].name;
  }

  public scrollHandler(e: any): void {
    const top = this.scrollElement.scrollTop;
    const height = this.scrollElement.scrollHeight;
    const offset = this.scrollElement.offsetHeight;

    if (top > height - offset - 1) {
      console.log("bottom");
    }

    if (top === 0 && !this.isLoadingOlderMessages) {
      console.log("top")
      this.lastScrollHeight = height;
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
    const roomDocRef = this._dbService.fs.collection(env.collections.chatRooms).doc(this.room.id).ref;
    const newMsgId = this._dbService.fs.createId();
    const newMsDocgRef = this._dbService.fs.collection(this.messagesPath).doc(newMsgId).ref;
    const increment = firestore.FieldValue.increment(1);

    const newMsg: ChatRoomMessage = {
      id: newMsgId,
      authorId: this.currUserId,
      text: this.newMsgTextArea.value.substring(0,30),
      timestamp: firestore.Timestamp.fromDate(new Date())
    };

    this.newMsgTextArea.value = null;

    this._dbService.fs.firestore.runTransaction((transaction: Transaction) => {
      return transaction.get(roomDocRef).then(doc => {
        const room = doc.data() as ChatRoom;
        const unreadMsgCount = room.users[this.otherUserId].isInTheRoom ? 0 : increment;
        const updateData = {
          msgCount: increment,
          lastMessage: newMsg,
          [`users.${this.otherUserId}.unreadMsgCount`]: unreadMsgCount
        }
        transaction.update(roomDocRef, updateData);
        transaction.set(newMsDocgRef, newMsg);
        //return {...room, ...updateData};
      }).catch(console.error);
    });

  }

  public getAvatar(msg: ChatRoomMessage): string {
    return this.room.users[msg.authorId].avatar;
  }

  private loadMoreMessages(): void {
    this.isLoadingOlderMessages = true;
    this._dbService.collection$<ChatRoomMessage>(
      this.messagesPath,
      ref => ref.orderBy('timestamp', 'desc').startAfter(this.lastDocRef.timestamp).limit(this.msgFetchLimit)
    ).pipe(
      first(),
      tap(messages => this.lastDocRef = messages[messages.length - 1]),
      map(messages => messages.reverse()),
      delay(1000)
    ).subscribe(messages => {
      if (messages.length === 0)
        this.toggleScrollEvents(false);
      this.messages.unshift(...messages);
      this.isLoadingOlderMessages = false;
      this.resetScroll();
    });
  }

  private subscribeToMessages(): void {
    this.messagesSub = this._dbService.collectionStateChanges$<ChatRoomMessage>(
      this.messagesPath,
      ref => ref.orderBy('timestamp', 'desc').limit(this.msgFetchLimit),
      ['added']
    ).pipe(
      tap(messages => {
        if (!this.lastDocRef && messages.length > 0) {
          this.lastDocRef = messages[messages.length - 1];
          setTimeout(() => this.ionContent.scrollToBottom(), 200);
        }
      }),
      map(messages => messages.reverse())
    ).subscribe(messages => {
      this.messages = this.messages.concat(messages);
    });
  }

  private get messagesPath(): string {
    return `${env.collections.chatRooms}/${this.room.id}/Messages`;
  }

  /**
 * toggle scroll events to enable/disable loading older messages
 * @param value 
 */
  private toggleScrollEvents(value: boolean): void {
    this.ionContent.scrollEvents = value;
  }

  /**
   * TODO: find a way to disable scrolling instead of "rewinding"
   */
  private resetScroll(): void {
    setTimeout(() => {
      this.scrollElement.scrollTop += this.scrollElement.scrollHeight - this.lastScrollHeight - 80;
    }, 100);
  }

}
