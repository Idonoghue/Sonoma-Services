import { Injectable, ɵConsole } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor() { }

  parseFile(content: string | ArrayBuffer) {
    // formatting const's
    const ROW_LENGTH = 4;
    const NAME_COL = 0;
    const SHIFT_TYPE_COL = 1;
    const SHIFT_START_COL = 2;
    const SHIFT_END_COL = 3;

    // parse into string array
    let contentArray = this.parse(content);

    let parsedArray = contentArray;
    for(var shiftIter = 1; shiftIter < contentArray.length - 1; shiftIter++){
        parsedArray[shiftIter][NAME_COL] = this.getEmployeeIDFromName(contentArray[shiftIter][NAME_COL]);
        parsedArray[shiftIter][SHIFT_START_COL] = this.roundToMinute(this.ExcelDateToJSDate(contentArray[shiftIter][SHIFT_START_COL]));
        parsedArray[shiftIter][SHIFT_END_COL] = this.roundToMinute(this.ExcelDateToJSDate(contentArray[shiftIter][SHIFT_END_COL]));
    }
    return parsedArray;
  }

  private parse(content: string | ArrayBuffer) {
    content = <string>content;
    var contentRows = content.split('\r\n');
    var contentArray = [[]];
    for(var rows = 0; rows < contentRows.length; rows++){
      contentArray[rows] = contentRows[rows].split(',');
    }
    return contentArray;
  }

  private getEmployeeIDFromName(name: string) {
    name = name.trim();
    const EMPLOYEE_NAME_TO_ID_MAP = new Map([["VERN", "Q0OXW96qUPvojgzEY1ko"],
                                             ["ELI", "mmu5Q2gjWI6j2IsXg2a1"],
                                             ["CODY", "QxmnhwUhU7C5FNJMJMgi"],
                                             ["ISAAC D.", "8P6mksd53Yf1WN9KvwLU"],
                                             ["DARREN", "h9vH0Cwc13gcdZFKNDjE"],
                                             ["JON", "M5Mgl259PX7kRJ3QKTk2"],
                                             ["MJ", "JHYyte2A63exUoPKY8df"],
                                             ["DAVE", "24lZVO5zIPvOa7F6PSBd"],
                                             ["PHIL", "3xYKFQdkZcXWl5Jl6DWz"],
                                             ["RILEY", "PuDcMprYFBrJEv9ml1UQ"],
                                             ["ISAAC M.", "EK3yMiMyRJUR2MNHHvMF"],
                                             ["JOE", "3PMzZ2pzX524oNacPU2n"],
                                             ["MIKE M.", "6Tc6yqa4Yq4PDb1CNuM9"],
                                             ["GAVIN", "BdoZfKyK2Q5ydpJ23LEl"],
                                             ["TROY", "4tf5eg0ZrGAoQSUkMhpN"]
                                            ]);
    let empID = null;
    if(name.length > 0){
      EMPLOYEE_NAME_TO_ID_MAP.forEach( function(ID, employee) {
        if(name == employee) {
          empID = ID;
        };
      }.bind([name, "name"]));
    }
    return empID
  }

  private ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25568);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }

  private roundToMinute(date: Date) {
    let p = 60 * 1000; // milliseconds in a minute
    return new Date(Math.round(date.getTime() / p ) * p);
  }
}
Date.prototype.addDays = function(days: number) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}