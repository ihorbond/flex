import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, AfterViewInit } from '@angular/core';
import { EventInfoComponent } from '../event-info/event-info.component';
import { EventPeopleComponent } from '../event-people/event-people.component';
import { AlertController } from '@ionic/angular';

const defaultComponentType: string = "info";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements AfterViewInit {
  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  public countMeInIconName: string = "flash-outline";
  public title: string = "Event Info";

  constructor(
    public alertController: AlertController,
    private _resolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.createComponent(defaultComponentType);
  }

  public async countMeIn(): Promise<void> {
    this.countMeInIconName = "flash";
    const alert = await this.alertController.create({
      header: 'Fuck yeah dude 🤙',
      message: 'You are going to this event ',
      buttons: ['OK']
    });

    await alert.present();
  }

  public segmentChanged(e: any): void {
    //console.log('Segment changed', e.detail);
    this.createComponent(e.detail.value);
  }

  private createComponent(type: string): void {
    this.container.clear();
    switch(type) {
      case 'people': {
        this.title = "Match";
        const factory = this._resolver.resolveComponentFactory(EventPeopleComponent);
        const componentRef: ComponentRef<EventPeopleComponent> = this.container.createComponent(factory);
        break; 
      }
      case 'shop': {
        this.title = "Shop"
        // const factory = this._resolver.resolveComponentFactory(ShopComponent);
        // const componentRef: ComponentRef<ShopComponent> = this.container.createComponent(factory);
        break;
      } 
      default: {
        this.title = "Event Info"
        const factory = this._resolver.resolveComponentFactory(EventInfoComponent);
        const componentRef: ComponentRef<EventInfoComponent> = this.container.createComponent(factory);
        break;
      }
    }
  }

}
