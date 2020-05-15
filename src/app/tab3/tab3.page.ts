import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { User } from '../shared/models/user';
import { DbService } from '../shared/services/db.service';
import { first } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ChatRoom } from './models/chat-room';
import { firestore } from 'firebase/app';
import { DocumentReference } from '@firebase/firestore-types';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, AfterViewInit {
  @ViewChild(IonContent) ionContent: IonContent;

  public isLoadingOlderMessages: boolean;
  public chatRooms: ChatRoom[] = [];

  private user: User = null;
  private lastLoadedChatRoomDocRef: DocumentReference<ChatRoom>;
  private scrollingElement: HTMLElement;
  private readonly chatRoomLoadStep: number = 10;

  constructor(
    private _dbService: DbService
  ) { }

  ngOnInit() {
    //var userId = localStorage.getItem('userId');
    this.loadData(env.testUserId);
  }

  ngAfterViewInit(): void {
    this.ionContent.getScrollElement().then(el => this.scrollingElement = el);
  }

  public getRoomAvatar(room: ChatRoom): string {
    const userId = this.getUserId(room);
    return room.users[userId].avatar;
  }

  public getRoomName(room: ChatRoom): string {
    const userId = this.getUserId(room);
    return room.users[userId].name;
  }

  public async delete(roomIdx: number): Promise<void> {
    //delete from rooms collection
    this.chatRooms.splice(roomIdx, 1);
    const roomId = this.chatRooms[roomIdx].id;
    console.log("deleting room with ID ", roomId);
    await this._dbService.delete(`${env.collections.chatRooms}/${roomId}`);

    //delete referenc from user doc
    const idx = this.user.chatRooms.findIndex(x => x.id === roomId);
    this.user.chatRooms.splice(idx, 1);
    await this._dbService.updateAt(`${env.collections.users}/${this.user.id}`, this.user);
  }

  public scrollHandler(e: any): void {
    const top = this.scrollingElement.scrollTop;
    const height = this.scrollingElement.scrollHeight;
    const offset = this.scrollingElement.offsetHeight;
    //console.log(top, height, offset)

    if (top > height - offset - 1 && !this.isLoadingOlderMessages) {
      console.log("bottom");
      this.isLoadingOlderMessages = true;
      const lastLoadedIndex = this.user.chatRooms.findIndex(x => x === this.lastLoadedChatRoomDocRef);
      const startIdx = lastLoadedIndex - this.chatRoomLoadStep > 0 ? lastLoadedIndex - this.chatRoomLoadStep : 0;
      console.log(startIdx, lastLoadedIndex);
      this.loadChatRooms(startIdx, lastLoadedIndex);
      if (startIdx === 0) {
        //disable scroll events if all messages have been loaded 
        this.ionContent.scrollEvents = false;
      }
    }

    if (top === 0) {
      console.log("top");
    }
  }

  /**
   * temp func to seed the rooms for testing
   */
  public async createRoom(): Promise<void> {
    const date = new Date();
    const newRoom: ChatRoom = {
      createdOn: firestore.Timestamp.fromDate(date),
      numOfMessages: 0,
      preview: "Connected on " + date.toLocaleDateString(),
      users: {
        [this.user.id]: {
          name: this.user.firstName,
          avatar: this.user.avatar.url
        },
        '776AmtwkOnmZfgNSPFNw': {
          name: 'Vivi',
          avatar: 'https://firebasestorage.googleapis.com/v0/b/flex-6e95e.appspot.com/o/images%2Fusers%2F776AmtwkOnmZfgNSPFNw%2Fvivi.jpg?alt=media&token=cd3e6ce5-854f-449b-9828-9071666ebc4cg'
        }
      }
    };

    const newChatRoomDocRef: DocumentReference<ChatRoom> = await this._dbService.updateAt(env.collections.chatRooms, newRoom);
    this.user.chatRooms.push(newChatRoomDocRef);

    newChatRoomDocRef.get().then(doc => {
      const newChatRoomData = doc.data();
      newChatRoomData.id = doc.id;
      this.chatRooms.unshift(newChatRoomData);
      console.log("inserted room", newChatRoomData);
      this._dbService.updateAt(`${env.collections.users}/${this.user.id}`, this.user);
    });
    
  }

  private loadData(userId: string): void {
    this._dbService.doc$(`${env.collections.users}/${userId}`).pipe(first()).subscribe(user => {
      this.user = user;
      console.log("loaded user", this.user);
      const chatRoomsCount = this.user.chatRooms.length;
      if (chatRoomsCount > this.chatRoomLoadStep) {
        const startIdx = chatRoomsCount - this.chatRoomLoadStep;
        this.ionContent.scrollEvents = true; //enable scroll events to recognize when user reached bottom of list
        this.loadChatRooms(startIdx); //load chunk of chat rooms from the list
        console.log("last doc ref ", this.lastLoadedChatRoomDocRef);
      }
      else {
        this.loadChatRooms(0);
      }
    }, console.error);
  }

  private async loadChatRooms(start: number, end?: number): Promise<void> {
    const loadedChatRooms = await Promise.all(this.user.chatRooms
      .slice(start, end)
      .map(async (docRef: DocumentReference<ChatRoom>) => {
        const doc = await docRef.get();
        const chatRoom = doc.data() as ChatRoom;
        chatRoom.id = doc.id;
        console.log("loaded chat room", chatRoom);
        return chatRoom;
      })
      .reverse());

    this.chatRooms = this.chatRooms.concat(loadedChatRooms);
    this.lastLoadedChatRoomDocRef = this.user.chatRooms[start];
    this.isLoadingOlderMessages = false
  }

  private getUserId(room: ChatRoom): string {
    const users = room.users;
    return Object.keys(users).find(key => key !== this.user.id);
  }

  // public getRoomQuery(ref: CollectionReference): Query<DocumentData> {
  //   //var path = firestore.FieldPath.documentId()
  //   return ref.where('userIds', "array-contains", this.user.id)
  //     .orderBy("createdOn", "desc")
  //     .limit(5);
  // }

}
