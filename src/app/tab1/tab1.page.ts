import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, AfterViewInit } from '@angular/core';
import { FeedPost } from './models/feed-post';
import { FeedService } from './services/feed.service';
import { FeedPostComponent } from './components/feed-post/feed-post.component';
import { ModalController, ToastController } from '@ionic/angular';
import { NewPostComponent } from './components/new-post/new-post.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {
  @ViewChild('feed', { static: true, read: ViewContainerRef }) feed: ViewContainerRef;

  public isPosting: boolean;
  public feedPosts: ComponentRef<FeedPostComponent>[] = [];
  private feedItemsTotal: number = 10;
  private readonly step: number = 5;
  private factory: ComponentFactory<FeedPostComponent>;
  
  constructor(
    public toastController: ToastController,
    public modalController: ModalController,
    private _feedService: FeedService,
    private _resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.factory = this._resolver.resolveComponentFactory(FeedPostComponent);
    this.fetchData(0);
  }

  public async fetchData(startFrom: number): Promise<void> {
    const newPosts = await this._feedService.getFeedPosts(startFrom);
    newPosts.forEach(this.createComponent.bind(this));
  }

  public async loadData(e: any): Promise<void> {
    if(this.feedPosts.length < this.feedItemsTotal) {
      await this.fetchData(this.feedPosts.length + this.step);
      e.target.complete();
    }
    else {
      console.log("No more items")
      e.target.disabled = true;
    }
  }

  public searchFeed(e: any): void {
    console.log("search", e);
  }

  public feedSegmentChanged(e: any): void {
    console.log("segment change ", e);
  }

  public async addPost(): Promise<void> {
    console.log('add post');
    const modal = await this.modalController.create({
      component: NewPostComponent,
      swipeToClose: false,
      componentProps: {
        userId: 1
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("new post", data);

    if(data) {
      this.isPosting = true;
      this.showPostAcceptedToast();
      this._feedService.addPost(data).subscribe(
        (success) => {
          console.log("Posted!");
          this.createComponent(data);
        },
        (err) => console.log(err), 
        () => this.isPosting = false
      )}
  }

  private async showPostAcceptedToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Your post is being processed',
      duration: 2000
    });
    toast.present();
  }

  private createComponent(feedPost: FeedPost): void {
    const componentRef: ComponentRef<FeedPostComponent> = this.feed.createComponent(this.factory);
    componentRef.instance.post = feedPost;
    this.feedPosts.push(componentRef);
  }

}
