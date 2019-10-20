import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

const CLOSE_HOUR = 20;
const CLOSE_MIN = 0;
const OPEN_HOUR = 6;
const OPEN_MIN = 30;

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  constructor() {
  }

  getFutureShifts() {
      let db = firebase.firestore();
      let shiftsCol = db.collection("shifts");
      let current = firebase.firestore.Timestamp.now();
      return shiftsCol.where('shiftEnd', '>', current);
  }

  getFutureDays() {
    let db = firebase.firestore();
    let daysCol = db.collection("days");
    let current = toFirebaseTimestamp(new Date().getTime() - (60 * 60 * 24 * 1000));
    let currentTime = new firebase.firestore.Timestamp(Math.floor(current.getTime()/1000), 0)
    console.log('time cutoff: ', currentTime.toDate());

    return daysCol.where('date', '>=', currentTime)
  }

  getEmployeeFromShift(shift: any) {
      let db = firebase.firestore();
      let employees = db.collection("employees");
      return employees.doc(shift.data().employee.id);
  }
  getAllEmployees() {
      let db = firebase.firestore();
      let employees = db.collection("employees");
      return employees;
  }

  getOpenTime() {
    let openTime = new Date(Date.now());
    openTime.setMinutes(OPEN_MIN);
    openTime.setHours(OPEN_HOUR)
    return openTime;
  }

  getCloseTime() {
    let closeTime = new Date(Date.now());
    closeTime.setMinutes(CLOSE_MIN);
    closeTime.setHours(CLOSE_HOUR)
    return closeTime;
  }

  uploadNewShift(shiftArr) {
      const NAME_COL = 0;
      const SHIFT_TYPE_COL = 1;
      const SHIFT_START_COL = 2;
      const SHIFT_END_COL = 3;

      let db = firebase.firestore();
      let shiftsCol = db.collection("shifts");

      // Add a new document in collection "cities"
      shiftsCol.doc().set({
        employee: shiftArr[NAME_COL],
        shiftStart: shiftArr[SHIFT_START_COL],
        shiftEnd: shiftArr[SHIFT_END_COL],
        type: shiftArr[SHIFT_TYPE_COL]
      })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
      return;
  }
  uploadNewDay(shiftArr) {
    const DATE_COL = 0;
    const DAY_INFO_COL = 1;
    const SHIRT_START_COL = 2;

    let db = firebase.firestore();
    let shiftsCol = db.collection("days");

    // Add a new document in collection "cities"
    shiftsCol.doc().set({
    date: shiftArr[DATE_COL],
    dayInfo: shiftArr[DAY_INFO_COL],
    shirtStartInfo: shiftArr[SHIRT_START_COL]
    })
    .then(function() {
    console.log("Document successfully written!");
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });
    return;
  }
  removeAllShifts() {
      let db = firebase.firestore();
      let shiftsCol = db.collection("shifts");
      let allShiftIDs = [];
      shiftsCol.get().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
            shiftsCol.doc(doc.id).delete().then(function() {
              console.log("Document successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing document: ", error);
            });
        })
      });
      return;
  }
}
function toFirebaseTimestamp(secs) {
    console.log(new Date(secs - new Date(1970,0, 1).getTime()));
  return new Date(secs - new Date(1970,0, 1).getTime());
}
function toDateTime(secs) {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
return t;
}