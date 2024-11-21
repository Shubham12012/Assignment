import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CustomCalendarComponent  implements OnInit {

  isOpen: boolean = false;
  filters: { id: number, label: string }[] = [];
  activeFilter = 1;
  selectedDate: any = new Date().toISOString();
  isToDate = false;
  fromDate = null;
  @Output() selectedDateExport: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  open(isToDate: boolean = false, fromDate: string) {
    this.isOpen = true;
    this.isToDate = isToDate;
    this.fromDate = fromDate;
    if (isToDate) {
      this.filters = [
        { id: 0, label: "No date" },
        { id: 1, label: "Today" }
      ];
    }
    else {
      this.filters = [
        { id: 1, label: "Today" }, 
        { id: 2, label: "Next Monday" }, 
        { id: 3, label: "Next Tuesday" },
        { id: 4, label: "After 1 Week" }
      ];
    }
  }
  
  cancel() {
    this.isOpen = false;
  }

  applyFilter(activeid: number) {
    this.activeFilter = activeid;
    const today = new Date();

    switch (activeid) {
      case 0:
        this.selectedDate = null;
        break;
      case 1:
        this.selectedDate = today.toISOString();
        break;
      case 2:
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
        this.selectedDate = nextMonday.toISOString();
        break;
      case 3:
        const nextTuesday = new Date(today);
        nextTuesday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7) + 1);
        this.selectedDate = nextTuesday.toISOString();
        break;
      case 4:
        const afterOneWeek = new Date(today);
        afterOneWeek.setDate(today.getDate() + 7);
        this.selectedDate = afterOneWeek.toISOString();
        break;
      default:
        break;
    }
  }

  confirm() {
    this.selectedDateExport.emit({ date: this.selectedDate, isToDate: this.isToDate });
    this.isOpen = false;
  }

}
