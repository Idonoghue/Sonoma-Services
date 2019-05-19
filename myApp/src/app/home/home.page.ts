import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public tipBox = {
        title: "Welcome to Sonoma Services",
        content: "This is the very first version. It includes functionality for viewing the schedule, managing our detailing, entering which carts we've watered batteries for, among other things. If you have any questions let me know in person."
    }
    ngOnInit() {
  }
}
