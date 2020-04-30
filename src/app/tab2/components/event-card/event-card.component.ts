import { Component, OnInit, Input } from '@angular/core';
import { EventInfo } from '../../models/event-info';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: EventInfo;
  constructor() { }

  ngOnInit() {}

}
