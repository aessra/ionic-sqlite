import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RekeningPage } from './rekening';

@NgModule({
  declarations: [
    RekeningPage,
  ],
  imports: [
    IonicPageModule.forChild(RekeningPage),
  ],
  exports: [
    RekeningPage
  ]
})
export class RekeningPageModule {}
