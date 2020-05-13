import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DbService } from 'src/app/shared/services/db.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { first, map, tap, delay } from 'rxjs/operators';
import { ChatRoom } from '../../models/chat-room';
import { environment as env } from 'src/environments/environment';
import { ChatRoomMessage } from '../../models/message';
import { IonTextarea, IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Timestamp, CollectionReference, Query, DocumentData } from '@firebase/firestore-types';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonTextarea) newMsgTextArea: IonTextarea;
  @ViewChild(IonInfiniteScroll) infScroll: IonInfiniteScroll;

  public messages: ChatRoomMessage[] = [];
  public title: string;
  public currMsgText: string;
  public isInfScrollHidden: boolean = true;

  private currUserId: string = env.testUserId;
  private room: ChatRoom = null;
  private msgCounter = 0;
  private roomId: string;

  private mostRecentDocRef = null;

  private messagesSubscription: Subscription;

  private _lastDocRef: ChatRoomMessage = null;
  private get lastDocRef() {
    return this._lastDocRef;
  }
  private set lastDocRef(value) {
    console.log("last doc ref", value);
    this._lastDocRef = value;
  }

  constructor(
    private _dbService: DbService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }
  
  ngAfterViewInit(): void {
    //this.infScroll.position = "top";
  }

  ngOnInit() {
    // const room = this._router.getCurrentNavigation().extras.state;
    // this.room = <ChatRoom>room;
    // console.log("room from router", room);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    //TODO: update room's message count
  }

  public loadMoreMessages(limit: number = 5): void {
    this.isInfScrollHidden = false;
    this._dbService.collection$<ChatRoomMessage>(
      `${env.collections.chatRooms}/${this.roomId}/Messages`,
      ref => ref.orderBy('timestamp', 'desc').startAfter(this.lastDocRef.timestamp as Timestamp).limit(limit)
    ).pipe(
      first(),
      tap(messages => this.lastDocRef = messages[messages.length - 1]),
      map(messages => messages.reverse()),
      delay(1000)
    ).subscribe(messages => {
      this.isInfScrollHidden = true;
      // var currLen = this.messages.length;
      this.messages.unshift(...messages);
      //event.target.complete();
      //console.log(this.room.numOfMessages, this.messages.length)
      // if(this.msgCounter + this.room.numOfMessages >= this.messages.length) {
      //   event.target.disabled = true;
      // }
    });
  }

  public showOptions(): void {
    console.log("showOptions");
    // var obs$ = this.loadMoreMessages(4);
    this.loadMoreMessages();
  }

  public selectImage(): void {
    console.log("selectImage");
  }

  public sendMessage(): void {
    this.msgCounter++;

    const msg: ChatRoomMessage = {
      authorId: this.currUserId,
      text: this.newMsgTextArea.value,
      timestamp: new Date()
    };
    
    this._dbService.updateAt(`${env.collections.chatRooms}/${this.roomId}/Messages`, msg);
    this.newMsgTextArea.value = null;
  }

  public getAvatar(msg: ChatRoomMessage): string {
    return this.room.users[msg.authorId].avatar;
  }

  private loadData(): void {
    this._route.paramMap.pipe(
      first(),
      map((params: ParamMap) => params.get('id'))).subscribe(
        roomId => {
          this.roomId = roomId;
          this.loadRoom(roomId);

          this.messagesSubscription = this._dbService.collectionStateChanges$<ChatRoomMessage>(
            `${env.collections.chatRooms}/${this.roomId}/Messages`,
            ref => ref.orderBy('timestamp', 'desc').limit(3),
            ['added']
          ).pipe(
            tap(messages => {
              if(!this.lastDocRef)
                this.lastDocRef = messages[messages.length - 1];
              //console.log("messages", messages)
              //this.mostRecentDocRef = messages[0];
              //console.log("most recent doc", this.mostRecentDocRef);
            }),
            map(messages => messages.reverse())
          ).subscribe(messages => this.messages = this.messages.concat(messages))
        });
  }

  public queryFn(ref: CollectionReference): Query<DocumentData> {
    return this.mostRecentDocRef 
      ? ref.orderBy('timestamp', 'desc').endBefore(this.mostRecentDocRef.timestamp as Timestamp).limit(2) 
      : ref.orderBy('timestamp', 'desc').limit(2);
  }

  private loadRoom(roomId: string): void {
    this._dbService.doc$(`${env.collections.chatRooms}/${roomId}`).pipe(first()).subscribe(room => {
      console.log("loaded room", room)
      this.room = room;
      this.title = this.getTitle();
    })
  }

  private getTitle(): string {
    const id = Object.keys(this.room.users).find(key => key !== this.currUserId);
    return "Chat with " + this.room.users[id].name;
  }


}
