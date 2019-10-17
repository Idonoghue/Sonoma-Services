import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShiftsService } from '../services/schedule/shifts.service';
import { ScheduleImportModalPage } from '../schedule-import-modal/schedule-import-modal.page';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})

export class SchedulePage implements OnInit {
  public shifts: any;
  public employees: any;
  public dateList: Array<Date>;
  public shiftTypes;
  public shiftsOrganized: any;
  public openTime: Date;
  public closeTime: Date;
  public console = console;
  constructor(
      private shiftsService: ShiftsService,
      public modalController: ModalController
      ) {
          this.shiftTypes = ['Golf Shop', 'Outside Services', 'Other'];

       }

  ngOnInit() {
    this.shiftsService
      .getFutureShifts()
      .get()
      .then( shiftsSnapshot => {
          this.shifts = shiftsSnapshot.docs;
          console.log(this.shifts);
          this.initializeDateList(new Date());
          this.initializeShiftList();
      });
    this.shiftsService
      .getAllEmployees()
      .get()
      .then( employeesSnapshot => {
        this.employees = employeesSnapshot.docs;
        this.getShiftEmployees();
      });
    this.openTime = this.shiftsService.getOpenTime()
    this.closeTime = this.shiftsService.getCloseTime()
  }

  initializeDateList(startDate: Date): void {
    var endDate = startDate;
    // console.log(this.shifts.length);
    for(var x = 0; x < this.shifts.length; x++){
      // get the latest date in the list of future shifts
      if(this.shifts[x].data().shiftEnd.toDate() > endDate){
        endDate = this.shifts[x].data().shiftEnd.toDate();
      }
    }
    // list all dates between now and last date with a shift into dateList
    this.dateList = [];
    for(var i = startDate; i <= endDate; i = i.addDays(1)){
      this.dateList.push(i);
    }
    // console.log(this.dateList);
    return;
  }
  getShiftEmployees(): void {
    for(var x = 0; x < this.shifts.length; x++){
      //console.log("shift employee ref: " + this.shifts[x].data().employee.id);
      for(var y = 0; y < this.employees.length; y++) {
        if(this.shifts[x].data().employee == this.employees[y].id) {
          this.shifts[x].employeeNick = this.employees[y].data().Nick;
          //console.log("employee ID Match Found: " + this.shifts[x].employeeNick + this.employees[y].id);
        }
      }
    }
  }
  initializeShiftList(): void {
    let rows = this.dateList.length
    let columns = this.shifts.length
    // prematurely sort shifts by start timestamp
    this.shifts.sortBy(this.shifts[0].data().shiftStart);
    this.shiftsOrganized = [[]]
    // restructure shifts into 2D array by date
    let dateIter = 0;
    let shiftIter = 0;
    for (var i = 0; i < this.shifts.length;i++) {
      let shiftDate = this.shifts[i].data().shiftStart;
      shiftDate = shiftDate.toDate();
      console.log(shiftDate);
      console.log(this.dateList[dateIter]);
      console.log("dateIter: " + dateIter);
      console.log("shiftIter: " + shiftIter);
      if (shiftDate.getDay() == this.dateList[dateIter].getDay()) {
        this.shiftsOrganized[dateIter][shiftIter] = this.shifts[i];
        shiftIter++;
      }
      else {
        shiftIter = 0;
        if(dateIter < this.dateList.length - 1) {
          dateIter++;
          this.shiftsOrganized.push([]);
        }
        else break;
      }
    }
    console.table(this.shiftsOrganized)
    return;
  }

  isOpenShift(shiftStart) {
    if (shiftStart.getHours() == this.openTime.getHours() && shiftStart.getMinutes() == this.openTime.getMinutes()) return true;
    else return false;
  }

  isCloseShift(shiftEnd) {
    if (shiftEnd.getHours() == this.closeTime.getHours() && shiftEnd.getMinutes() == this.closeTime.getMinutes()) return true;
    else return false;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ScheduleImportModalPage,
      componentProps: {
        'modalCtrl': this.modalController
      }
    });
    return await modal.present();
  }
}


function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
return t;
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

Array.prototype.sortBy = function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
}
