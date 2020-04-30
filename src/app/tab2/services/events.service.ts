import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventInfo } from '../models/event-info';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private events = [
    {
      id: 1,
      organizer: { id: 1, name: "Spartan"},
      description: "MONTEREY 10K SUPER AND 5K SPRINT WEEKEND",
      pic: 'https://toughmudder.com/wp-content/uploads/2019/11/Tough-Mudder-Chicago-CARD_1240x1860.jpg',
      place: "Chicago",
      date: new Date(2020,6,6),
      numOfParticipants: Math.floor(Math.random() * 1000)
    },
    {
      id: 2,
      organizer: { id: 1, name: "Ironman"},
      description: "TRI-STATE NEW YORK 5K SPRINT WEEKEND",
      pic: 'https://toughmudder.com/wp-content/uploads/2019/11/TOugh-Mudder-Wknd-Twin-Cities-CARD-web.jpg',
      place: "TRI-STATE",
      date: new Date(2020,7,6),
      numOfParticipants: Math.floor(Math.random() * 1000)
    },
    {
      id: 3,
      organizer: { id: 1, name: "Tough Mudder"},
      description: "PALMERTON TRAIL 10K",
      pic: 'https://toughmudder.com/wp-content/uploads/2019/11/Tough-Mudder-Tri-State-CARD_1240x1860.jpg',
      place: "Palmetron",
      date: new Date(2020,7,12),
      numOfParticipants: Math.floor(Math.random() * 1000)
    }
  ] as EventInfo[];

  constructor() { }

  public getEvents(): Observable<EventInfo[]> {
    return of(this.events).pipe(delay(1000));
  }

  public getEventById(id: number): Observable<EventInfo> {
    return of(this.events.find(x => id === x.id)).pipe(delay(2000));
  }
}
