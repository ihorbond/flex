import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, AfterViewInit } from '@angular/core';
import { FeedPost } from './models/feed-post';
import { FeedService } from './services/feed.service';
import { FeedPostComponent } from './components/feed-post/feed-post.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {
  @ViewChild('feed', { static: true, read: ViewContainerRef }) feed: ViewContainerRef;

  public feedPosts: FeedPost[] = [];
  private feedItemsTotal: number = 15;
  private readonly step: number = 5;
  private factory: ComponentFactory<FeedPostComponent>;
  
  constructor(
    private _feedService: FeedService,
    private _resolver: ComponentFactoryResolver
  ) {}

  
  ngOnInit() {
    this.factory = this._resolver.resolveComponentFactory(FeedPostComponent);
  }

  ngAfterViewInit() {
    this.fetchData(0);
  }

  public async fetchData(startFrom: number): Promise<void> {
    const newPosts = await this._feedService.getFeedPosts(startFrom);
    newPosts.forEach(this.createElement.bind(this));
    this.feedPosts.concat(newPosts);
  }

  public async loadData(e: any): Promise<void> {
    console.log("load data called");
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

  private createElement(feedPost: FeedPost): void {
    //console.log(feedPost, this.feed);
    const componentRef: ComponentRef<FeedPostComponent> = this.feed.createComponent(this.factory);
    componentRef.instance.post = feedPost;
  }

  public feedSegmentChanged(e: any): void {
    console.log("segment change ", e);
  }

  public addPost(): void {
    console.log('add post');
  }



}
