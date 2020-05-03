import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from './keyframes';
import { Subject } from 'rxjs';
import { SwipeCard } from '../../models/swipe-card';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(750, keyframes(kf.swiperight))),
      transition('* => swipeleft', animate(750, keyframes(kf.swipeleft)))
    ])
  ]
})
export class SwipeCardComponent implements OnInit {

  @Input() currentCard: SwipeCard = null;
  @Input() parentSubject: Subject<{ direction: string, card: SwipeCard }>;
  @Output() getNextCard: EventEmitter<any> = new EventEmitter();

  animationState: string;
  constructor() { }

  ngOnInit() {
    //this.getNextCard.emit();
    this.parentSubject.subscribe(event => {
      this.startAnimation(event.direction)
    });
  }

  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

  public startAnimation(state: string): void {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  public resetAnimationState(state: string): void {
    this.animationState = '';
    this.getNextCard.emit();
    //this.index++;
  }

}
