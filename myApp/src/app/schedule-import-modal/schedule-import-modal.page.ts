import { Component, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { FileHandlerService } from '../services/schedule/file-handler.service';
import { ShiftsService } from '../services/schedule/shifts.service';

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
  public shiftArray: Array<Array<String>>
  public dayArray: Array<Array<String>>

  constructor(navParams: NavParams,
              private shiftsService: ShiftsService) {
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
  parseFile(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.readAsText(file);
    fileReader.onloadend = function(e) {
      self.fileContent = fileReader.result;
      var fileHandler = new FileHandlerService();
      [self.shiftArray, self.dayArray] = fileHandler.parseFile(self.fileContent)
      console.log(self.dayArray);
      self.uploadShifts();
      self.uploadDays();
    }
    // temporary: Will add a seperate button to modal later
  }
  uploadShifts(): void {
    // iterate through array and create new doc for Shifts collection
    // call shift service to handle each specific shift element
    // error check shiftArray using shifts service
    for(let i = 0; i < this.shiftArray.length - 1; i++){
      this.shiftsService.uploadNewShift(this.shiftArray[i]);
    }
    return;
  }
  uploadDays(): void {
    for(let i = 0; i < this.dayArray.length; i++){
      this.shiftsService.uploadNewDay(this.dayArray[i]);
    }
    return;
  }
  removeAllShifts(): void {
      this.shiftsService.removeAllShifts();
      return;
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
