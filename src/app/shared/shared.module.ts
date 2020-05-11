import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToAge } from './pipes/to-age';

@NgModule({
  declarations: [ToAge],
  imports: [
    CommonModule
  ],
  exports: [ToAge]
})
export class SharedModule { }
