import { Component } from '@angular/core';
import { EventsService } from './services/events.service';
import { EventInfo } from './models/event-info';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public events$: Observable<EventInfo[]> = null;

  constructor(private _eventsService: EventsService) {}

  loadData(event) {
    console.log(event)
  }

  ngOnInit() {
    this.events$ = this._eventsService.getEvents().pipe(
      tap(value => console.log(value))
    );
  }
}
