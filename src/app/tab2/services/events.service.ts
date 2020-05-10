import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventInfo } from '../models/event-info';
import { delay, map, tap } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: DbService) { }

  public getEvents(): Observable<EventInfo[]> {
    return this.db.collection$('Events')
  }

  public getEventById(id: string): Observable<EventInfo> {
    return this.db.doc$(`Events/${id}`)
  }
}
