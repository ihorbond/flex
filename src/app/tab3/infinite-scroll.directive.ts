import { Directive, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    //console.log(event);
    try {
      const top = event.target.scrollTop;
      const height = this.el.nativeElement.scrollHeight;
      const offset = this.el.nativeElement.offsetHeight;

      //this.scrollPosition.emit('bottom');

      //console.log(top, height, offset)

      if(top > height - offset -1) {
        this.scrollPosition.emit('bottom');
      }

      if(top === 0) {
        this.scrollPosition.emit('top');
      }
    }
    catch(err) {
      console.log(err);
    }
  }

}
