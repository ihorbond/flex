import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SwipeCardService } from '../../services/swipe-card.service';
import { SwipeCard } from '../../models/swipe-card';

@Component({
  selector: 'app-event-people',
  templateUrl: './event-people.component.html',
  styleUrls: ['./event-people.component.scss'],
})
export class EventPeopleComponent implements OnInit {
  public currentCard: SwipeCard = null;
  public parentSubject: Subject<{ direction: string, card: SwipeCard }> = new Subject();
  public isLoading: boolean;

  private cards: SwipeCard[] = [];
  private index = 0;

  constructor(
    public cardService: SwipeCardService
  ) { }

  ngOnInit(): void {
    this.loadCards();
  }

  public cardAnimation(value: string): void {
    var data = { direction: value, card: this.cards[this.index] };
    this.parentSubject.next(data);
  }

  public getNextCard(): void {
    this.currentCard = this.cards[this.index];
    this.index++;
  }

  private loadCards(): void {
    this.isLoading = true;
    this.cardService.getCards().subscribe(cards => {
      this.isLoading = false;
      this.cards = this.cards.concat(cards);
      this.currentCard = this.cards[this.index];
      this.index++;
      console.log(this.cards, this.currentCard, this.index);
    });
  }
  // @ViewChild('slider', { static:true }) slider: any;

  // slideOpts = {
  //   initialSlide: 0,
  //   speed: 400,
  //   loop: true
  // };

  // public cards: SlideCard[] = [
  //   {
  //     id: 1,
  //     userId: 1,
  //     name: "Courtney",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 2,
  //     userId: 2,
  //     name: "Alex",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 3,
  //     userId: 3,
  //     name: "Vivi",
  //     pic: "",
  //     description: "Hello"
  //   }
  // ];

  // bufferCards: SlideCard[] = [
  //   {
  //     id: 4,
  //     userId: 4,
  //     name: "Jenny",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 5,
  //     userId: 5,
  //     name: "Perra",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 6,
  //     userId: 6,
  //     name: "Suka",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 7,
  //     userId: 7,
  //     name: "Daniela",
  //     pic: "",
  //     description: "Hello"
  //   },
  //   {
  //     id: 8,
  //     userId: 8,
  //     name: "Amanda",
  //     pic: "",
  //     description: "Hello"
  //   },    {
  //     id: 9,
  //     userId: 9,
  //     name: "Bianca",
  //     pic: "",
  //     description: "Hello"
  //   }
  // ]

  // constructor(
  //   private _cardService: SliderCardService
  // ) { }

  // ngAfterViewInit(): void {
  //   //console.log(this.slider);
  // }

  // ngOnInit() {
  //   //this.loadCards();
  // }

  // public prevIdx = 0;
  // public firstTime = true;
  // private bufferCardIdx = 0;

  // public async ionSlideDidChange(e: any) {

  //   if(this.firstTime) {
  //     this.firstTime = false;
  //     return;
  //   }

  //   const currIdx = e.srcElement.swiper.realIndex;

  //   if(currIdx > this.prevIdx) {
  //     console.log("left")
  //   }
  //   else {
  //     console.log("right")
  //   }

  //   console.log(this.cards, this.bufferCardIdx);

  //   let past = this.cards[this.prevIdx];
  //   let newCard = this.bufferCards[this.bufferCardIdx];

  //   past.id = newCard.id;
  //   past.description = newCard.description;
  //   past.name = newCard.name;

  //   this.slider.update();
  //   this.bufferCardIdx++;

  //   this.prevIdx = currIdx;

  //   //console.log(this.cards);

  //   // if(this.slider.isBeginning()) {
  //   //   console.log("beginning");

  //   //   this.cards[1] = {
  //   //     id: 9,
  //   //     userId: 9,
  //   //     name: "Bianca",
  //   //     pic: "",
  //   //     description: "Hello"
  //   //   };

  //   //   this.slider.update();
  //   //   return;
  //   // }
  //   // if(this.slider.isEnd()) {
  //   //   this.cards.push({
  //   //     id: 9,
  //   //     userId: 9,
  //   //     name: "Bianca",
  //   //     pic: "",
  //   //     description: "Hello"
  //   //   });
  //   //   this.cards.splice(1,1);
  //   //   e.srcElement.swiper.updateSlides();
  //   //   return;
  //   // }
  //   //if(this.firstSlide)
  //   //console.log("will change", e);
  //   //const idx = await this.slider.getCurrentIndex();
  //   // //const swiper = this.slider.getSwiper();
  //   // const realIndex = e.srcElement.swiper.realIndex;

  //   // console.log(realIndex);
  //   // //console.log(idx, realIndex);
  //   // //if(idx !== 0) {
  //   //   if(this.firstTime) {
  //   //     this.firstTime = false;
  //   //     return;
  //   //   }
  //   //   //means we are not on the very 1st slide after init

  //   //   setTimeout(() => {
  //   //     this.cards.splice(realIndex-1, 1);
  //   //     this.slider.update();
  //   //     console.log(this.cards);
  //   //     this.prevIdx = realIndex;}, 1000);
  //   //}
  //   // if(this.cards.length < 4) {
  //   //   this.loadCards();
  //   // }

  // }

  // private loadCards(): void {
  //   this._cardService.getCards().subscribe(this.cards.concat);
  // }

  // trackByMethod(index:number, el:any): number {
  //   return el.id;
  // }

}
