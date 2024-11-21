import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonService, EmployeeData } from '../services/common.service';
import { IndexdbService } from '../services/indexdb.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { isAfter, addDays, parseISO } from 'date-fns';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmployeeListComponent implements OnInit {

  private router = inject(Router);
  private commonService = inject(CommonService);
  private indexdbService = inject(IndexdbService);
  private alertController = inject(AlertController);

  employeeList: EmployeeData[] = [];
  employeeListSignal = signal(this.employeeList);
  currentEmployees: EmployeeData[] = [];
  previousEmployees: EmployeeData[] = [];
  currentEmployeeCheck: boolean = false;
  previousEmployeeCheck: boolean = false;

  constructor() { }

  async ngOnInit() {
    await this.indexdbService.ensureDBInitialized();
    await this.loadEmployeeList();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url == '/' || this.router.url == '/employee-list') {
        this.loadEmployeeList();
      }
    });
  }

  private async loadEmployeeList() {
    try {
      this.employeeList = await this.indexdbService.getAllItems();
      this.employeeListSignal.set(this.employeeList);
      this.currentEmployees = this.employeeList.filter(obj => obj.toDate == null);
      this.previousEmployees = this.employeeList.filter(obj => obj.toDate != null);
    }
    catch {
      await this.commonService.showToast("Something went wrong");
    }
  }

  AddEmployee() {
    this.router.navigateByUrl("add-employee-details");
  }

  EditEmployee(empId: number) {
    this.router.navigate(["add-employee-details"], { queryParams: { id: empId } });
  }

  async DeleteEmployee(empId: number) {
    try {
      const alert = await this.alertController.create({
        header: "Confirm !!",
        subHeader: "Are you sure you want to delete record?",
        buttons: [
          {
            text: "Cancel",
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: async () => {
              await this.indexdbService.deleteItem(empId);
              await this.commonService.showToast("Employee record deleted");
              await this.loadEmployeeList();
            }
          }
        ]
      });

      await alert.present();
    }
    catch {
      await this.commonService.showToast("Something went wrong");
    }
  }

  filterEmployeeList() {
    if ((this.currentEmployeeCheck && this.previousEmployeeCheck) || (!this.currentEmployeeCheck && !this.previousEmployeeCheck)) {
      this.employeeList = this.employeeListSignal();
    }
    else if (this.currentEmployeeCheck) {
      this.employeeList = this.employeeListSignal().filter(obj => obj.toDate == null || isAfter(parseISO(obj.toDate), new Date()));
    }
    else if (this.previousEmployeeCheck) {
      this.employeeList = this.employeeListSignal().filter(obj => obj.toDate != null && !isAfter(addDays(parseISO(obj.toDate), 1), new Date()));
    }
  }
}
