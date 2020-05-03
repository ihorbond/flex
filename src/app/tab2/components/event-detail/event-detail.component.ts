import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, AfterViewInit } from '@angular/core';
import { EventInfoComponent } from '../event-info/event-info.component';
import { EventPeopleComponent } from '../event-people/event-people.component';
import { AlertController, ModalController } from '@ionic/angular';
import { EventPeopleFilterComponent } from '../event-people-filter/event-people-filter.component';

const defaultComponentType: string = "info";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements AfterViewInit {
  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  public componentActionIcon: string = "flash-outline";
  public title: string = "Event Info";
  public invokeCurrCompAction: () => void;

  constructor(
    public alertController: AlertController,
    private _modalController: ModalController,
    private _resolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.createComponent(defaultComponentType);
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
        this.componentActionIcon = "filter-outline";
        this.invokeCurrCompAction = this.filterMatches;
        const factory = this._resolver.resolveComponentFactory(EventPeopleComponent);
        const componentRef: ComponentRef<EventPeopleComponent> = this.container.createComponent(factory);
        break; 
      }
      case 'shop': {
        this.title = "Shop"
        this.componentActionIcon = "filter-outline";
        this.invokeCurrCompAction = this.filterShopItems;
        // const factory = this._resolver.resolveComponentFactory(ShopComponent);
        // const componentRef: ComponentRef<ShopComponent> = this.container.createComponent(factory);
        break;
      } 
      default: {
        this.title = "Event Info"
        this.componentActionIcon = "flash-outline";
        this.invokeCurrCompAction = this.countMeIn;
        const factory = this._resolver.resolveComponentFactory(EventInfoComponent);
        const componentRef: ComponentRef<EventInfoComponent> = this.container.createComponent(factory);
        break;
      }
    }
  }

  private async countMeIn(): Promise<void> {
    this.componentActionIcon = "flash";
    const alert = await this.alertController.create({
      header: 'Fuck yeah dude 🤙',
      message: 'You are going to this event ',
      buttons: ['OK']
    });

    await alert.present();
  }

  private async filterMatches(): Promise<void> {
    const modal = await this._modalController.create({
      component: EventPeopleFilterComponent
    });
    return await modal.present();
  }

  private filterShopItems(): void {
    console.log("filter shop items works")
  }

}
