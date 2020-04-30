import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { EventInfoComponent } from '../event-info/event-info.component';
import { EventPeopleComponent } from '../event-people/event-people.component';

const defaultComponentType: string = "info";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  public countMeInIconName: string = "flash-outline";

  constructor(
    private _resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.createComponent(defaultComponentType);
  }

  public countMeIn(): void {
    this.countMeInIconName = "flash";
  }

  public segmentChanged(e: any): void {
    console.log('Segment changed', e.detail);
    this.createComponent(e.detail.value);
  }

  private createComponent(type: string): void {
    this.container.clear();
    switch(type) {
      case 'people': {
        const factory = this._resolver.resolveComponentFactory(EventPeopleComponent);
        const componentRef: ComponentRef<EventPeopleComponent> = this.container.createComponent(factory);
        break; 
      }
      // case 'shop': {
      //   const factory = this._resolver.resolveComponentFactory(ShopComponent);
      //   const componentRef: ComponentRef<ShopComponent> = this.container.createComponent(factory);
      //   break;
      // } 
      default: {
        const factory = this._resolver.resolveComponentFactory(EventInfoComponent);
        const componentRef: ComponentRef<EventInfoComponent> = this.container.createComponent(factory);
        break;
      }
    }
  }

}
