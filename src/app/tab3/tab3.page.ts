import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user';
import { DbService } from '../shared/services/db.service';
import { first, exhaustMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChatRoom } from './models/chat-room';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public chatRooms: ChatRoom[] = null;
  private user: User = null;

  constructor(
    private _dbService: DbService
  ) { }

  ngOnInit() {
    this.loadData(environment.testUserId);
  }

  public getChatRoomAvatar(roomIdx: number): string {
    const users = this.chatRooms[roomIdx].users;
    const userId = Object.keys(users).find(key => key !== this.user.id);
    return users[userId].avatar;
  }

  public getChatRoomName(roomIdx: number): string {
    const users = this.chatRooms[roomIdx].users;
    const userId = Object.keys(users).find(key => key !== this.user.id);
    return users[userId].name;
  }

  public delete(roomIdx: number): void {
    console.log("delete room");
    this.chatRooms.splice(roomIdx, 1);
  }

  private loadData(userId: string): void {
    this._dbService.doc$(`Users/${userId}`).pipe(
      first(),
      exhaustMap(doc => {
        this.user = doc;
        //console.log(doc, this.user.chatRoomIds);
        return this._dbService.collection$('Rooms', ref => ref.where(firestore.FieldPath.documentId(), "in", this.user.chatRoomIds).limit(20));
      })
      ).subscribe(chatRooms => {
       //console.log(chatRooms);
       this.chatRooms = chatRooms;
     }, console.error);
  }
}
