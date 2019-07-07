import { Component, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-schedule-import-modal',
  templateUrl: './schedule-import-modal.page.html',
  styleUrls: ['./schedule-import-modal.page.scss'],
})
export class ScheduleImportModalPage {
  // Data passed in by componentProps
  @Input() modalCtrl;

  constructor(navParams: NavParams) {
    // componentProps can also be accessed at construction time using NavParams
    console.log(navParams.get('modalCtrl'));
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
