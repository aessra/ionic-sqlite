import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRekeningDetailPage } from './modal-rekening-detail';

@NgModule({
  declarations: [
    ModalRekeningDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRekeningDetailPage),
  ],
  exports: [
    ModalRekeningDetailPage
  ]
})
export class ModalRekeningDetailPageModule {}
