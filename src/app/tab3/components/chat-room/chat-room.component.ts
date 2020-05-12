import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from 'src/app/shared/services/db.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, first, map } from 'rxjs/operators';
import { ChatRoom } from '../../models/chat-room';
import { environment } from 'src/environments/environment';
import { ChatRoomMessage } from '../../models/message';
import { IonTextarea } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {
  @ViewChild(IonTextarea) newMsgTextArea: IonTextarea;

  public messages$: Observable<any> = null;
  public title: string = 'Chat with Oleh';
  public currMsgText: string;

  private currUserId: string = environment.testUserId;
  private room: ChatRoom = null;
  private msgCounter = 0;
  private roomId: string;

  constructor(
    private _dbService: DbService,
    private _route: ActivatedRoute,
    //private _routeSnapshot: ActivatedRouteSnapshot
  ) { }

  ngOnInit() {
    this.getRoomId();
    
  }

  public showOptions(): void {
    console.log("showOptions");
  }

  public selectImage(): void {
    console.log("selectImage");
  }

  public sendMessage(): void {
    this.msgCounter++;
    console.log("send");
    const msg: ChatRoomMessage = {
      authorId: this.currUserId,
      text: this.newMsgTextArea.value,
      timestamp: new Date()
    };
    this._dbService.updateAt(`Rooms/${this.roomId}/Messages`, msg);
    this.newMsgTextArea.value = null;
  }

  public getAvatar(userId: number): string {
    return this.room.users[userId].avatar;
  }

  private getRoomId(): void {
    this._route.paramMap.pipe(
      first(),
      map((params: ParamMap) => {
        //console.log("room id", roomId);
        return params.get('id');
      })).subscribe(roomId => {

        this.loadRoom(roomId);
        //this.messages$ = this._dbService.collection$(`Rooms/${this.roomId}/Messages`);
        // this._dbService.collection$(`Rooms/${this.roomId}/Messages`).subscribe(msg => {
        //   console.log(msg);
        // })
        this._dbService.fs
          .collection('Rooms')
          .doc(roomId)
          .collection('Messages')
          .snapshotChanges().pipe(map(action => action.map(x => x.payload.doc.data())))
          .subscribe(console.log)
      });
  }

  private loadRoom(roomId: string): void {
     this._dbService.doc$(`Rooms/${roomId}`).pipe(first()).subscribe(room => {
       console.log("room", room)
       this.room = room;
     })
  }







}
