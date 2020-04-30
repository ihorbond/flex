import { Component } from '@angular/core';
import { EventsService } from './services/events.service';
import { EventInfo } from './models/event-info';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public events$: Observable<EventInfo[]> = null;

  constructor(private _eventsService: EventsService) {}

  ngOnInit() {
    this.events$ = this._eventsService.getEvents();
  }

}
