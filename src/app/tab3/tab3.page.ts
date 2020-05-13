import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { User } from '../shared/models/user';
import { DbService } from '../shared/services/db.service';
import { first, exhaustMap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
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
    public el: ElementRef,
    private _dbService: DbService
  ) { }

  ngOnInit() {
    //var userId = localStorage.getItem('userId');
    this.loadData(env.testUserId);
  }

  public getRoomAvatar(room: ChatRoom): string {
    const userId = this.getUserId(room);
    return room.users[userId].avatar;
  }

  public getRoomName(room: ChatRoom): string {
    const userId = this.getUserId(room);
    return room.users[userId].name;
  }

  public delete(roomIdx: number): void {
    console.log("delete room");
    this.chatRooms.splice(roomIdx, 1);
  }

  private loadData(userId: string): void {
    this._dbService.doc$(`${env.collections.users}/${userId}`).pipe(
      first(),
      exhaustMap(doc => {
        this.user = doc;
        //console.log(doc, this.user.chatRoomIds);
        return this._dbService.collection$<ChatRoom>(
          env.collections.chatRooms,
          ref => ref.where(firestore.FieldPath.documentId(), "in", this.user.chatRoomIds).limit(10));
      })
      ).subscribe(chatRooms => {
       //console.log(chatRooms);
       this.chatRooms = chatRooms;
     }, console.error);
  }

  private getUserId(room: ChatRoom): string {
    const users = room.users;
    return Object.keys(users).find(key => key !== this.user.id);
  }



  // public onScroll(event) {
  //   console.log(event);
  // }
}
