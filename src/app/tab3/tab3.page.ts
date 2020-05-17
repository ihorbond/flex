import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../shared/models/user';
import { DbService } from '../shared/services/db.service';
import { environment as env } from 'src/environments/environment';
import { ChatRoom } from './models/chat-room';
import { firestore } from 'firebase/app';
import { CollectionReference, Query } from '@firebase/firestore-types';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { first, delay } from 'rxjs/operators';

const formats = {
  sameDay: 'h:mm A',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'MM/DD/YY'
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  public chatRooms: ChatRoom[] = null;
  public userId = env.testUserId;

  private user: User = null;
  private chatRoomFetchLimit: number = 10;
  private chatRoomsSub: Subscription = null;

  constructor(
    private _dbService: DbService
  ) { }

  ngOnInit() {
    //var userId = localStorage.getItem('userId');
    this.loadData();
  }

  ngOnDestroy() {
    this.chatRoomsSub.unsubscribe();
  }

  public timeToNow(roomIdx: number): string {
    return moment(this.chatRooms[roomIdx].lastMessage.timestamp.toDate()).calendar(null, formats);
  }

  public getRoomAvatar(room: ChatRoom): string {
    const userId = this.getOtherUserId(room);
    return room.users[userId].avatar;
  }

  public getRoomName(room: ChatRoom): string {
    const userId = this.getOtherUserId(room);
    return room.users[userId].name;
  }

  public hasUnread(room: ChatRoom): boolean {
    return room.users[this.userId].unreadMsgCount > 0;
  }

  public delete(roomIdx: number): void {
    const roomId = this.chatRooms[roomIdx].id;
    console.log("deleting room with ID ", roomId);
    this.chatRooms.splice(roomIdx, 1);
    this._dbService.delete(`${env.collections.chatRooms}/${roomId}`);
  }

  /**
   * temp func to seed the rooms for testing
   */
  public createRoom(): void {
    const date = new Date();
    const newRoom: ChatRoom = {
      createdAt: firestore.Timestamp.fromDate(date),
      msgCount: 0,
      userIds: [this.userId, '776AmtwkOnmZfgNSPFNw'],
      users: {
        [this.userId]: {
          name: this.user.firstName,
          avatar: this.user.avatar.url,
          unreadMsgCount: 0,
          isInTheRoom: false
        },
        '776AmtwkOnmZfgNSPFNw': {
          name: 'Vivi',
          avatar: 'https://firebasestorage.googleapis.com/v0/b/flex-6e95e.appspot.com/o/images%2Fusers%2F776AmtwkOnmZfgNSPFNw%2Fvivi.jpg?alt=media&token=cd3e6ce5-854f-449b-9828-9071666ebc4cg',
          unreadMsgCount: 0,
          isInTheRoom: false
        }
      },
      lastMessage: {
        text: `Connected on ${date.toLocaleDateString()}`,
        timestamp: firestore.Timestamp.fromDate(date),
        authorId: ''
      }
    };

    this._dbService.updateAt(env.collections.chatRooms, newRoom);
  }

  public loadMore(e: any): void {
    this.chatRoomFetchLimit += 10;
    this.subscribeToChatRooms(e);
  }

  private loadData(): void {
    this._dbService.doc$(`${env.collections.users}/${this.userId}`).pipe(first()).subscribe(user => {
      this.user = user;
      console.log("loaded user", this.user);
      this.subscribeToChatRooms();
    }, console.error);
  }

  private subscribeToChatRooms(e?: any): void {
    if (this.chatRoomsSub)
      this.chatRoomsSub.unsubscribe();

    this.chatRoomsSub = this._dbService.collection$<ChatRoom>(
      env.collections.chatRooms,
      this.query.bind(this))
      .pipe(delay(1000))
      .subscribe((chatRooms: ChatRoom[]) => {
        const prevRoomCount = (this.chatRooms || []).length;
        this.chatRooms = chatRooms;

        if (e) {
          e.target.complete();
          e.target.disabled = prevRoomCount === this.chatRooms.length;
        }
      }, console.error);
  }

  private query(ref: CollectionReference): Query {
    return ref.where('userIds', 'array-contains', this.userId).orderBy('lastMessage.timestamp', 'desc').limit(this.chatRoomFetchLimit);
  }

  private getOtherUserId(room: ChatRoom): string {
    return Object.keys(room.users).find(key => key !== this.userId);
  }

}
