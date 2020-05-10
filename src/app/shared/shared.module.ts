import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimestampToDatePipe } from './pipes/timestamp-to-date.pipe';
import { TimestampToAgePipe } from './pipes/timestamp-to-age.pipe';

@NgModule({
  declarations: [TimestampToDatePipe, TimestampToAgePipe],
  imports: [
    CommonModule
  ],
  exports: [TimestampToDatePipe, TimestampToAgePipe]
})
export class SharedModule { }
