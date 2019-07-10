import { Component, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { FileHandlerService } from '../services/schedule/file-handler.service';

@Component({
  selector: 'app-schedule-import-modal',
  templateUrl: './schedule-import-modal.page.html',
  styleUrls: ['./schedule-import-modal.page.scss'],
})
export class ScheduleImportModalPage {
  // Data passed in by componentProps
  @Input() modalCtrl;
  public uploader:FileUploader = new FileUploader({});
  public fileContent: string | ArrayBuffer = '';

  constructor(navParams: NavParams) {
    // componentProps can also be accessed at construction time using NavParams
    // console.log(navParams.get('modalCtrl'));
    // const URL = 'path_to_api';
    document.addEventListener("onFileSelected", function(){
        console.log(this.getFiles());
    });
  }
  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }
  parseFile(fileList: FileList, scheduleType: boolean): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.readAsText(file);
    fileReader.onloadend = function(e) {
      self.fileContent = fileReader.result;
      var fileHandler = new FileHandlerService();
      fileHandler.parseAndUpload(scheduleType, self.fileContent)
    }
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
