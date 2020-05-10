import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';
import * as moment from 'moment';


@Pipe({
  name: 'timestampToAge'
})
export class TimestampToAgePipe implements PipeTransform {

  transform(value: Timestamp, ...args: any[]): any {
    return moment(value.toDate()).toNow(true);
  }

}
