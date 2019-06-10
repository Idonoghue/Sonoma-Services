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
      var allShifts = db.collection("shifts");
      var current = firebase.firestore.Timestamp.now();
      return allShifts.where('shiftClose', '>', current);
  }
}
