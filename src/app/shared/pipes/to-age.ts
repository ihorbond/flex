import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'toAge'
})
export class ToAge implements PipeTransform {

  transform(value: Date, ...args: any[]): any {
    return value ? moment(value).toNow(true) : value;
  }

}
