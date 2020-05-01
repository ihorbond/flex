import { Component, OnInit, Input } from '@angular/core';
import { FeedPost } from '../../models/feed-post';
import * as moment from 'moment';

@Component({
  selector: 'app-feed-post',
  templateUrl: './feed-post.component.html',
  styleUrls: ['./feed-post.component.scss'],
})
export class FeedPostComponent implements OnInit {
  @Input() post: FeedPost;

  public userPhoto: string = "https://www.materialui.co/materialIcons/action/account_circle_grey_192x192.png";
  public eventName: string = "Spartan Race";
  public fname: string = "Tiffany"
  public distance: number = Math.floor(Math.random() * 200);
  
  constructor() { }

  ngOnInit() {}

  public calculateDate(date: Date) {
    return moment(date).fromNow();
  }
}
