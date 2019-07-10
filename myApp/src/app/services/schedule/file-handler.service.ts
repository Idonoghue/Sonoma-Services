import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor() { }

  parseAndUpload(type: boolean, content: string | ArrayBuffer) {
      console.log("this works!" + type + content);
  }
}
