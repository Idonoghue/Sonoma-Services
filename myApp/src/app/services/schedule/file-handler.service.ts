import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor() { }

  parseAndUpload(type: boolean, content: string | ArrayBuffer) {
    // formatting const's
    const ROW_LENGTH = 8;
    const TITLE_ROW = 0;
    const DATE_TITLE_ROW = 1;
    const DATE_ROW_1 = 3
    const SHIRT_ROW_1 = 4;
    const EVENTS_ROW_1 = 5;
    const EMPLOYEE_START_ROW_1 = 6;
    const DATE_ROW_2 = 18;
    const SHIRT_ROW_2 = 19;
    const EVENTS_ROW_2 = 20;
    const EMPLOYEE_START_ROW_2 = 21;

    // parse into string array
    let contentArray = this.parse(content);
    console.log("contentArray: ");
    console.log(contentArray);


    // get month & day of first Date in schedule
    var dayNum;
    var monthNum;
    var now = new Date();
    [monthNum, dayNum] = this.parseTitleDateString(contentArray[DATE_TITLE_ROW][0])
    var referenceDate = new Date(now.getFullYear(), monthNum, dayNum);
    var shiftDate = referenceDate;

    // parse schedule type and shift open time from content
    var scheduleType = this.getScheduleType(contentArray[TITLE_ROW][0])
    var openTimeHours;
    var openTimeMinutes;
    [openTimeHours, openTimeMinutes] = this.getOpenTime(contentArray[DATE_ROW_1][0]);
    const closeTimeHours = 21;
    const closeTimeMinutes = 0;

    var employeeID;
    var secondWeek = false;
    // iterate by row
    for(var y = DATE_ROW_1; y < contentArray.length; y++) {
      // get first day in each date row
      if(y/ROW_LENGTH == DATE_ROW_2) {
          referenceDate.addDays(7);
      }
      console.log("reference date: ", referenceDate.toString());
      shiftDate = referenceDate;
      // Does this row start with an employee's name?
      employeeID = this.getEmployeeIDFromName(contentArray[y][0]);
      if(employeeID != null){
        console.log("employee: " + contentArray[y])
        // extract shift Data
        for(var x = 1; x < ROW_LENGTH; x++){
          var shiftCell = contentArray[y][x].trim();
          console.log("new shift date: " + shiftDate);

          if(shiftCell.length > 0){
            // handle one shift in cell
            //if(!isMultipleShifts(shiftCell)){
              var shiftStart = this.getShiftOpen(shiftCell, shiftDate, openTimeHours, openTimeMinutes);
              var shiftEnd = this.getShiftClose(shiftCell, shiftDate, closeTimeHours, closeTimeMinutes);
              //console.log("shift: " + contentArray[y + x] + " on " + shiftDate);
              //console.log("ShiftStart: " + shiftStart);
              //console.log("shiftEnd: " + shiftEnd);
            //}
            // handle multiple shifts in on cell
          }

          // iterate shift date
          shiftDate.addDays(1);
        }
      }
    // remove empty elements
    //if(contentArray[x] == "") {
    //    contentArray.splice(x, 1);
    //    x--;
    //}
    }
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
                                             ["MIKE M.", "6Tc6yqa4Yq4PDb1CNuM9"]
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

  // specifically designed to parse the first date from the second row of the schedule file
  private parseTitleDateString(date: string): Array<number>{
    date = date.trim();
    var monthNum = 0;
    var dayNum = 0;
    const ELEMENT_REF = date.search(" ");
    switch(date.substr(0, ELEMENT_REF)){
      case "January":
        monthNum = 0;
        break;
      case "February":
        monthNum = 1;
        break;
      case "March":
        monthNum = 2;
        break;
      case "April":
        monthNum = 3;
        break;
      case "May":
        monthNum = 4;
        break;
      case "June":
        monthNum = 5;
        break;
      case "July":
        monthNum = 6;
        break;
      case "August":
        monthNum = 7;
        break;
      case "September":
        monthNum = 8;
        break;
      case "October":
        monthNum = 9;
        break;
      case "November":
        monthNum = 10;
        break;
      case "December":
        monthNum = 11;
    }
    // check if dayNum is 2 digits
    if('0123456789'.includes(date[ELEMENT_REF + 2])){
        dayNum = parseInt(date.substr(ELEMENT_REF + 1, 2));
    }
    else {
        dayNum = parseInt(date.substr(ELEMENT_REF + 1, 1));
    }
    return [monthNum, dayNum];
  }

  private getScheduleType(title: string): string {
      title = title.trim();
      if(title.indexOf("Outside") > -1) {
        return "Outside";
      }
      else return "Inside";
  }

  private getOpenTime(openTime: string): Array<number> {
      openTime = openTime.trim();
      var colonIndex = openTime.indexOf(":");
      if(colonIndex > 0) {
        var hours = parseInt(openTime.substring(0, colonIndex));
        var minutes = parseInt(openTime.substring(colonIndex + 1));
        console.log("Open Time: " + openTime);
      }
      else {
          console.log("PARSE ERROR: colon not found in open time cell");
          console.log("Open: " + openTime);
          return;
      }
      return [hours, minutes];
  }
  private isMultipleShifts(shift: string): boolean {
      shift.toLowerCase();
      if(shift.indexOf("close") > -1 && shift.indexOf("jr. camp") > 1) {
          return true;
      }
      else {
          return false;
      }
  }
  private getShiftOpen(shift: string, date: Date, openHours: number, openMinutes: number): Date {
    console.log("shiftCell: " + shift);
    shift = shift.toLowerCase();
    // for an opening shift
    if(shift.indexOf("open") > -1){
      date.setHours(openHours, openMinutes);
      console.log("default open: " + date);
      return date;
    }
    // for jr. camp shift
    else if (shift.indexOf("jr. camp") > -1) {
      // TODO change these values to global(?) const
      const jrCampOpenHrs = 7;
      const jrCampOpenMin = 30;
      date.setHours(jrCampOpenHrs, jrCampOpenMin);
      return date;
    }
    // for regular shifts
    else if ("0123456789".includes(shift[0])) {
      var openString = shift.substring(0, shift.indexOf("-"));
      var colonIndex = shift.indexOf(":");
      if(openString.indexOf(":") > -1) {
        date.setHours(parseInt(openString.substring(0, colonIndex)), parseInt(openString.substring(colonIndex + 1)));
      }
      else {
        date.setHours(parseInt(openString), 0);
      }
    }
    console.log("shift open: " + date);
    return date;
  }
  private getShiftClose(shift: string, date: Date, closeHours: number, closeMinutes: number): Date {
    shift = shift.toLowerCase();
    if(shift.indexOf("close") > -1){
      date.setHours(closeHours, closeMinutes);
      console.log("default close: " + date);
      return date;
    }
    else if(shift.indexOf("jr. camp") > -1) {
      // TODO change these values to global(?) const
      const jrCampCloseHrs = 9;
      const jrCampCloseMin = 30;
      date.setHours(jrCampCloseHrs, jrCampCloseMin);
      return date;
    }
    else if(shift.indexOf("-") > -1) {
      var closeString = shift.substring(shift.indexOf("-") + 1, );
      var colonIndex = closeString.indexOf(":");
      if(closeString.indexOf(":") > -1) {
        console.log("closeString: " + closeString);
        date.setHours(parseInt(closeString.substring(0, colonIndex)), parseInt(closeString.substring(colonIndex + 1)));
        console.log("closing time: " + date);
      }
      else {
        date.setHours(parseInt(closeString), 0);
      }
    }
    console.log("shift close time: " + date);
    return date;

  }
}
Date.prototype.addDays = function(days: number) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}