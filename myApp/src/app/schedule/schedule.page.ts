import { Component, OnInit } from '@angular/core';
import { ShiftsService } from '../services/schedule/shifts.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public shifts: any;
  public employees: any;
  public dateList: Array<Date>;
  constructor(
      private shiftsService: ShiftsService
      ) { }

  ngOnInit() {
    this.shiftsService
      .getFutureShifts()
      .get()
      .then( shiftsSnapshot => {
          this.shifts = shiftsSnapshot.docs;
          console.log(this.shifts);
          this.initializeDateList(new Date());
      });
    this.shiftsService
      .getAllEmployees()
      .get()
      .then( employeesSnapshot => {
        this.employees = employeesSnapshot.docs;
        this.getShiftEmployees();
      });
  }

  initializeDateList(startDate: Date): void {
    var endDate = startDate;
    // console.log(this.shifts.length);
    for(var x = 0; x < this.shifts.length; x++){
      console.log(this.shifts[x].data().employee.id);
      // get the latest date in the list of future shifts
      if(this.shifts[x].data().shiftEnd.toDate() > endDate){
        endDate = this.shifts[x].data().shiftEnd.toDate();
      }
    }
    console.log(endDate);
    // list all dates between now and last date with a shift into dateList
    this.dateList = [];
    for(var i = startDate; i <= endDate; i = i.addDays(1)){
      this.dateList.push(i);
    }
    console.log(this.dateList);
    // console.log(this.dateList);
    return;
  }
  getShiftEmployees(): void {
    for(var x = 0; x < this.shifts.length; x++){
      // console.log("shift employee ref: " + this.shifts[x].data().employee.id);
      for(var y = 0; y < this.employees.length; y++) {
        // console.log("employee ID: " + this.employees[y].id);
        if(this.shifts[x].data().employee.id == this.employees[y].id) {
          this.shifts[x].employeeNick = this.employees[y].data().Nick;
        }
      }
    }
  }
}

Date.prototype.addDays = function(days: number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.getWeekDay = function() {
    switch(this.getDay()) {
        case 0:
          return 'Sun';
        case 1:
          return 'Mon';
        case 2:
          return 'Tues';
        case 3:
          return 'Wed';
        case 4:
          return 'Thurs';
        case 5:
          return 'Fri';
        case 6:
          return 'Sat';
    }
}

Date.prototype.getTimeStandard = function() {
    var hours = this.getHours();
    var AMPM;
    if(hours > 12){
        AMPM = 'PM';
        hours = hours % 12;
    }

    else if(hours > 0){
        AMPM = 'AM'
    }
    else {
        AMPM = 'AM'
        hours = 12;
    }
    var minutes = this.getMinutes().toString();
    if(minutes == '0') minutes = '00';
    return(hours.toString() + ':' + minutes + AMPM)
}

Date.prototype.getAbbrMonth = function() {
    switch(this.getMonth()) {
      case 0:
        return 'Jan';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'July';
      case 7:
        return 'Aug';
      case 8:
        return 'Sept';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      case 11:
        return 'Dec';
    }
}
