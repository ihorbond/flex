import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedPost } from '../../models/feed-post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  @Input() userId: number;
  
  public newPostForm: FormGroup;
  
  constructor(
    public modalController: ModalController,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.newPostForm = this._fb.group({
      userId: [this.userId],
      eventId: [1],
      description: ["null", [Validators.required, Validators.maxLength(200)]],
      pic: ['https://img.grouponcdn.com/deal/3QcF7S2Uw7EKhbgmSuVVFBqx2ADh/3Q-700x420/v1/c700x420.jpg'],
      location: ["Madison, WI"], //should be lat/lng
      date: [null]
    })
  }

  public cancel(): void {
    this.modalController.dismiss(null);
  }

  public post(): void {
    const newPost: FeedPost = this.newPostForm.value as FeedPost;
    newPost.date = new Date();
    this.modalController.dismiss(newPost);
  }

}
