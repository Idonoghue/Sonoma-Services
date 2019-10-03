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
      var shiftsCol = db.collection("shifts");
      var current = firebase.firestore.Timestamp.now();
      return shiftsCol.where('shiftEnd', '>', current);
  }
  getEmployeeFromShift(shift: any) {
      var db = firebase.firestore();
      var employees = db.collection("employees");
      return employees.doc(shift.data().employee.id);
  }
  getAllEmployees() {
      var db = firebase.firestore();
      var employees = db.collection("employees");
      return employees;
  }

  uploadNewShift(shiftArr) {
      const NAME_COL = 0;
      const SHIFT_TYPE_COL = 1;
      const SHIFT_START_COL = 2;
      const SHIFT_END_COL = 3;

      var db = firebase.firestore();
      var shiftsCol = db.collection("shifts");

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
  removeAllShifts() {
      var db = firebase.firestore();
      var shiftsCol = db.collection("shifts");
      var allShiftIDs = [];
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
