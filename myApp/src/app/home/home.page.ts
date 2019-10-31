import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public tipBox = {
        title: "Welcome to Sonoma Services",
        content: "This is the very first version. It includes functionality for changing profile information, viewing the schedule, and uploading new schedule data from a file. If you have any questions let me know in person."
    }
    ngOnInit() {
  }
}
