import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class ShiftsService {

  constructor() {
  }

  getFutureShifts() {
      var db = firebase.firestore();
      var shifts = db.collection("shifts");
      var current = firebase.firestore.Timestamp.now();
      return shifts.where('shiftEnd', '>', current);
  }
  getEmployeeFromShift(shift: any) {
      var db = firebase.firestore();
      var employees = db.collection("employees");
      return employees.doc(shift.data().employee.id);
  }
  getAllEmployees() {
      var db = firebase.firestore();
      var employees = db.collection("employees");
      return employees
  }
}
