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
export class ChatRoomComponent  {
//   @ViewChild(IonTextarea) newMsgTextArea: IonTextarea;
//   @ViewChild(IonContent) ionContent: IonContent;

//   public messages: ChatRoomMessage[] = [];
//   public isLoadingOlderMessages: boolean;
//   public currUserId = env.testUserId;

//   private room: ChatRoom = null;
//   private messagesSubscription: Subscription;
//   private scrollingElement: HTMLElement;
//   private lastDocRef: ChatRoomMessage = null;
//   private readonly initialMessageFetchLimit: number = 10;
//   private lastScrollHeight: number = 0;

//   constructor(
//     private _dbService: DbService,
//     private _router: Router
//   ) { }

//   ngOnInit() {
//     //this.currUserId = localStorage.getItem('userId');
//     this.room = this._router.getCurrentNavigation().extras.state as ChatRoom;
//     console.log("room from router's state ", this.room);
//     this.subscribeToMessages();
//   }

//   ngAfterViewInit() {
//     this.ionContent.getScrollElement().then(el => this.scrollingElement = el);
//     this.toggleScrollEvents(this.room.numOfMessages > this.initialMessageFetchLimit);
//     this.markAsRead();
//   }

//   ngOnDestroy() {
//     this.messagesSubscription.unsubscribe();

//     //TODO: give this to bg worker or make part of transaction with newly sent message
//     //update room's message count
//     this._dbService.updateAt(`${env.collections.chatRooms}/${this.room.id}`, this.room);
//   }

//   public get roomTitle(): string {
//     const id = Object.keys(this.room.users).find(key => key !== this.currUserId);
//     return "Chat with " + this.room.users[id].name;
//   }

//   public markAsRead(): void {
//     const currUser = this.room.users[this.currUserId];
//     if (currUser.hasUnread) {
//       currUser.hasUnread = false;
//       const path = `${env.collections.chatRooms}/${this.room.id}`;
//       this._dbService.updateAt(path, this.room).catch(console.error);
//     }
//   };

//   public scrollHandler(e: any): void {
//     const top = this.scrollingElement.scrollTop;
//     const height = this.scrollingElement.scrollHeight;
//     const offset = this.scrollingElement.offsetHeight;

//     if (top > height - offset - 1) {
//       console.log("bottom");
//     }

//     if (top === 0 && !this.isLoadingOlderMessages) {
//       console.log("top")
//       this.lastScrollHeight = height;
//       this.loadMoreMessages();
//     }
//   }

//   public showOptions(): void {
//     console.log("showOptions");
//   }

//   public selectImage(): void {
//     console.log("selectImage");
//   }

//   public async sendMessage(): Promise<void> {
//     const msg: ChatRoomMessage = {
//       authorId: this.currUserId,
//       text: this.newMsgTextArea.value,
//       timestamp: new Date()
//     };

//     this._dbService.updateAt(this.messagesPath, msg).then(_ => {
//       this.newMsgTextArea.value = null;
//       this.room.numOfMessages++;
//     }).catch(console.error);
//   }

//   public getAvatar(msg: ChatRoomMessage): string {
//     return this.room.users[msg.authorId].avatar;
//   }

//   private loadMoreMessages(limit: number = 5): void {
//     this.isLoadingOlderMessages = true;
//     this._dbService.collection$<ChatRoomMessage>(
//       this.messagesPath,
//       ref => ref.orderBy('timestamp', 'desc').startAfter(this.lastDocRef.timestamp as Timestamp).limit(limit)
//     ).pipe(
//       first(),
//       tap(messages => this.lastDocRef = messages[messages.length - 1]),
//       map(messages => messages.reverse()),
//       delay(1000)
//     ).subscribe(messages => {
//       if (messages.length === 0)
//         this.toggleScrollEvents(false);
//       this.messages.unshift(...messages);
//       this.isLoadingOlderMessages = false;
//       this.resetScroll();
//     });
//   }

//   private subscribeToMessages(): void {
//     this.messagesSubscription = this._dbService.collectionStateChanges$<ChatRoomMessage>(
//       this.messagesPath,
//       ref => ref.orderBy('timestamp', 'desc').limit(this.initialMessageFetchLimit),
//       ['added']
//     ).pipe(
//       tap(messages => {
//         if (this.isFirstTimeLoad && messages.length > 0) {
//           this.lastDocRef = messages[messages.length - 1];
//           setTimeout(() => this.ionContent.scrollToBottom(), 100);
//         }
//       }),
//       map(messages => messages.reverse())
//     ).subscribe(messages => {
//       this.messages = this.messages.concat(messages);
//     });
//   }

//   private get messagesPath(): string {
//     return `${env.collections.chatRooms}/${this.room.id}/Messages`;
//   }

//   private isFirstTimeLoad(): boolean {
//     return this.lastDocRef === null;
//   }

//   /**
//  * toggle scroll events to enable/disable loading older messages
//  * @param value 
//  */
//   private toggleScrollEvents(value: boolean): void {
//     this.ionContent.scrollEvents = value;
//   }

//   /**
//    * TODO: find a way to disable scrolling instead of "rewinding"
//    */
//   private resetScroll(): void {
//     setTimeout(() => {
//       this.scrollingElement.scrollTop += this.scrollingElement.scrollHeight - this.lastScrollHeight - 80;
//     }, 100);
//   }
//   // public queryFn(ref: CollectionReference): Query<DocumentData> {
//   //   return this.mostRecentDocRef 
//   //     ? ref.orderBy('timestamp', 'desc').endBefore(this.mostRecentDocRef.timestamp as Timestamp).limit(2) 
//   //     : ref.orderBy('timestamp', 'desc').limit(2);
//   // }

}
