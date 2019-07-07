import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScheduleImportModalPage } from './schedule-import-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleImportModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScheduleImportModalPage]
})
export class ScheduleImportModalPageModule {}
