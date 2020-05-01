import { Injectable } from '@angular/core';
import { FeedPost } from '../models/feed-post';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private readonly step: number = 5;
  private feedPosts = [
    {
      id: 1,
      userId: 1,
      eventId: 1,
      numOfFlexes: Math.floor(Math.random() * 500),
      numOfComments: Math.floor(Math.random() * 100),
      date: new Date(2020, 3, 1),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a massa in nisl vehicula varius a non purus. Nullam neque nisi, mattis eu varius a, pulvinar at lacus. Proin sed fringilla lorem",
      pic: "https://life.spartan.com/wp-content/uploads/2019/03/TMP-PA-Saturday-2018-0182.jpg"
    },
    {
      id: 2,
      userId: 2,
      eventId: 2,
      numOfFlexes: Math.floor(Math.random() * 500),
      numOfComments: Math.floor(Math.random() * 100),
      date: new Date(2020, 3, 3),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a massa in nisl vehicula varius a non purus. Nullam neque nisi, mattis eu varius a, pulvinar at lacus. Proin sed fringilla lorem",
      pic: "https://life.spartan.com/wp-content/uploads/2017/08/WomenStartingEnduranceRacing__2048x1152.jpg"
    },
    {
      id: 3,
      userId: 3,
      eventId: 3,
      numOfFlexes: Math.floor(Math.random() * 500),
      numOfComments: Math.floor(Math.random() * 100),
      date: new Date(2020, 3, 5),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a massa in nisl vehicula varius a non purus. Nullam neque nisi, mattis eu varius a, pulvinar at lacus. Proin sed fringilla lorem",
      pic: "https://pbs.twimg.com/media/CngskK0WcAAL1Sa.jpg"
    },
    {
      id: 4,
      userId: 4,
      eventId: 1,
      numOfFlexes: Math.floor(Math.random() * 500),
      numOfComments: Math.floor(Math.random() * 100),
      date: new Date(2020, 3, 8),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a massa in nisl vehicula varius a non purus. Nullam neque nisi, mattis eu varius a, pulvinar at lacus. Proin sed fringilla lorem",
      pic: "https://pbs.twimg.com/media/CxFz4KOUUAA9-bd.jpg"
    },
    {
      id: 5,
      userId: 5,
      eventId: 2,
      numOfFlexes: Math.floor(Math.random() * 500),
      numOfComments: Math.floor(Math.random() * 100),
      date: new Date(2020, 3, 11),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a massa in nisl vehicula varius a non purus. Nullam neque nisi, mattis eu varius a, pulvinar at lacus. Proin sed fringilla lorem",
      pic: "https://pbs.twimg.com/media/DUqo2QVV4AAvzXX.jpg"
    }
  ] as FeedPost[];

  constructor() { }

  public getFeedPosts(startFrom: number): Promise<FeedPost[]> {
    return (of(this.feedPosts.slice(startFrom, startFrom + this.step)).pipe(delay(2000)) as Observable<FeedPost[]>).toPromise();
  }

  public addPost(post: FeedPost): Observable<any> {
    post.id = this.feedPosts.pop().id + 1;
    this.feedPosts.push(post);
    return of(null);
  }
}
