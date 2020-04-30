import { Component, OnInit } from '@angular/core';
import { EventInfo } from '../../models/event-info';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
})
export class EventInfoComponent implements OnInit {
  public eventInfo: EventInfo;
  public hasLoaded: boolean;

  constructor(
    private _eventsService: EventsService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this._route.snapshot.paramMap.get('eventId');
    this._eventsService.getEventById(id).subscribe((eventInfo: EventInfo) => {
      this.eventInfo = eventInfo;
      this.hasLoaded = true;
    });
  }

}
