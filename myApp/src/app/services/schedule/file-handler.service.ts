import { Injectable, ɵConsole } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor() { }

  parseFile(content: string | ArrayBuffer) {
    // shift formatting const's
    const ROW_LENGTH = 4;
    const NAME_COL = 0;
    const SHIFT_TYPE_COL = 1;
    const SHIFT_START_COL = 2;
    const SHIFT_END_COL = 3;

    // day formatting const's
    const DATE_COL = 0;
    const DAY_INFO_COL = 1;
    const SHIRT_START_COL = 2;

    // parse into string array
    let [contentArray, dayArray] = this.parse(content);

    let parsedArray = contentArray;
    let parsedDayArray = dayArray;
    for(var shiftIter = 1; shiftIter < contentArray.length - 1; shiftIter++){
        parsedArray[shiftIter][NAME_COL] = this.getEmployeeIDFromName(contentArray[shiftIter][NAME_COL]);
        parsedArray[shiftIter][SHIFT_START_COL] = this.roundToMinute(this.ExcelDateToJSDate(contentArray[shiftIter][SHIFT_START_COL]));
        parsedArray[shiftIter][SHIFT_END_COL] = this.roundToMinute(this.ExcelDateToJSDate(contentArray[shiftIter][SHIFT_END_COL]));
    }
    for(var shiftIter = 1; shiftIter < parsedDayArray.length - 1; shiftIter++){
        parsedDayArray[shiftIter][DATE_COL] = this.roundToMinute(this.ExcelDateToJSDate(dayArray[shiftIter][DATE_COL]));
        parsedDayArray[shiftIter][DAY_INFO_COL] = dayArray[shiftIter][DAY_INFO_COL];
        parsedDayArray[shiftIter][SHIRT_START_COL] = dayArray[shiftIter][SHIRT_START_COL];
    }
    parsedDayArray.shift();
    parsedDayArray.pop();
    console.table(parsedDayArray);
    return [parsedArray, parsedDayArray];
  }

  private parse(content: string | ArrayBuffer) {
    content = <string>content;
    var dayContent;
    [content, dayContent] = content.split('Date,Day Info,Shirt / Start Info,')
    var contentRows = content.split('\r\n');
    var dayContentRows = dayContent.split('\r\n');
    var contentArray = [[]];
    var dayContentArray = [[]];

    for(var rows = 0; rows < contentRows.length; rows++){
      contentArray[rows] = contentRows[rows].split(',');
    }
    for(var rows = 0; rows < dayContentRows.length; rows++){
      dayContentArray[rows] = dayContentRows[rows].split(',');
    }
    return [contentArray, dayContentArray];
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