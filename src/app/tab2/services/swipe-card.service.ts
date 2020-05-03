import { Injectable } from '@angular/core';
import { SwipeCard } from '../models/swipe-card';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwipeCardService {

  private cards: SwipeCard[] = [
    {
      id: 1,
      userId: 1,
      name: "Courtney",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 2,
      userId: 2,
      name: "Alex",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 3,
      userId: 3,
      name: "Vivi",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 4,
      userId: 4,
      name: "Jenny",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 5,
      userId: 5,
      name: "Perra",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 6,
      userId: 6,
      name: "Suka",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 7,
      userId: 7,
      name: "Daniela",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },
    {
      id: 8,
      userId: 8,
      name: "Amanda",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    },    {
      id: 9,
      userId: 9,
      name: "Bianca",
      pic: "https://picsum.photos/200",
      description: "Hello",
      age: Math.floor(Math.random() * (40 - 18) + 18)
    }
  ];

  constructor() { }

  public getCards(): Observable<SwipeCard[]> {
    return of(this.cards).pipe(delay(2000));
  }
}
