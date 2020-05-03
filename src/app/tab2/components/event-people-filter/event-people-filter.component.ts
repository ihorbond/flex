import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-people-filter',
  templateUrl: './event-people-filter.component.html',
  styleUrls: ['./event-people-filter.component.scss'],
})
export class EventPeopleFilterComponent implements OnInit {

  constructor(private _modalController: ModalController) { }

  ngOnInit() {}

  public cancel(): void {
    this._modalController.dismiss(null);
  }

  public done(): void {
    

    this._modalController.dismiss({});
  }
}
