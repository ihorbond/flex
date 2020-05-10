import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: Timestamp, ...args: any[]): any {
    return value.toDate();
  }

}
