import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition, AnimationEvent } from '@angular/animations';
import * as kf from './keyframes';
import { Subscription } from 'rxjs';
import { SwipeCard } from '../../models/swipe-card';
import { SwipeCardService } from '../../services/swipe-card.service';

@Component({
  selector: 'app-event-people',
  templateUrl: './event-people.component.html',
  styleUrls: ['./event-people.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(750, keyframes(kf.swiperight))),
      transition('* => swipeleft', animate(750, keyframes(kf.swipeleft)))
    ])
  ]
})
export class EventPeopleComponent implements OnInit {
  public cards: SwipeCard[] = [];
  public index: number = 0;
  public isLoading: boolean = true;
  public animationState: string = null;

  private cardsSubscription: Subscription = null;

  constructor(public cardService: SwipeCardService) { }

  ngOnInit() {
    this.cardsSubscription = this.loadCards();
  }

  public animate(state: string): void {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  public resetAnimationState(e: AnimationEvent): void {
    this.animationState = null;
    if (e.toState) {
      this.index++;
    }
  }

  public chat(): void {
    console.log("chat works");
  }

  private loadCards(): Subscription {
    return this.cardService.getCards().subscribe(cards => {
      this.isLoading = false;
      this.cards = this.cards.concat(cards);
      console.log(this.cards);
    });
  }
}
