import { Component, OnInit } from '@angular/core';
import { ShiftsService } from '../services/schedule/shifts.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public shifts: any;
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
      });
  }

}
