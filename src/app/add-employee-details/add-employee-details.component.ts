import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicModule } from '@ionic/angular';
import { CustomCalendarComponent } from './custom-calendar/custom-calendar.component';
import { FormsModule } from '@angular/forms';
import { CommonService, EmployeeData } from '../services/common.service';
import { IndexdbService } from '../services/indexdb.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-employee-details',
  templateUrl: './add-employee-details.component.html',
  styleUrls: ['./add-employee-details.component.scss'],
  imports: [CommonModule, IonicModule, CustomCalendarComponent, FormsModule]
})
export class AddEmployeeDetailsComponent  implements OnInit {

  @ViewChild('custcal') custcal: CustomCalendarComponent;

  employeeName = "";
  selectedRole = "";
  fromDate: any = new Date().toISOString();
  toDate: any = null;
  isEdit: boolean = false;

  private actionSheetCtrl = inject(ActionSheetController);
  private alertCtrl = inject(AlertController);
  private location = inject(Location);
  private commonService = inject(CommonService);
  private indexdbService = inject(IndexdbService);
  private route = inject(ActivatedRoute);

  constructor() { }

  async ngOnInit() {
    await this.indexdbService.ensureDBInitialized();
    const id = this.route.snapshot.queryParamMap.get('id');
    this.isEdit = id == null ? false : true;
    if (this.isEdit) {
      const empDetails = await this.indexdbService.getItem(Number(id));
      this.employeeName = empDetails.employeeName;
      this.selectedRole = empDetails.employeeRole;
      this.fromDate = empDetails.fromDate;
      this.toDate = empDetails.toDate;
    }
  }

  async openRoleActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Product Designer",
          handler: () => { this.selectedRole = 'Product Designer' }
        },
        {
          text: "Flutter Developer",
          handler: () => { this.selectedRole = 'Flutter Developer' }
        },
        {
          text: "QA Tester",
          handler: () => { this.selectedRole = 'QA Tester' }
        },
        {
          text: "Product Owner",
          handler: () => { this.selectedRole = 'Product Owner' }
        },
        {
          text: "Add custom role",
          handler: async () => {
            const alert = await this.alertCtrl.create({
              header: "Role",
              subHeader: "What is the role of employee?",
              inputs: [
                {
                  placeholder: "Enter role",
                  name: "custom_role"
                }
              ],
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel"
                },
                {
                  text: "Add",
                  handler: (ev) => { this.selectedRole = ev.custom_role }
                }
              ]
            });
            await alert.present();
          }
        }
      ]
    });

    await actionSheet.present();
  }

  cancel() {
    this.location.back();
  }

  openCustomCalendar(isToDate = false) {
    this.custcal.open(isToDate, this.fromDate);
  }

  onFromDateSelection(event: any) {
    if (event.isToDate) {
      this.toDate = event.date;
    } else {
      this.fromDate = event.date;
    }
  }

  validateForm() {
    if (this.employeeName.trim() == "") {
      this.commonService.showToast("Please enter employee name");
    }
    else if (this.selectedRole.trim() == "") {
      this.commonService.showToast("Please select employee role");
    }
    else if (String(this.fromDate).trim() == "") {
      this.commonService.showToast("Please select from date");
    }
    else if (this.toDate != null && (Date.parse(this.toDate) < Date.parse(this.fromDate))) {
      this.commonService.showToast("Please select valid to date");
    }
    else {
      this.saveEmployee();
    }
  }

  private async saveEmployee() {
    const data: EmployeeData = {
      employeeName: this.employeeName,
      employeeRole: this.selectedRole,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    try {
      if (!this.isEdit) {
        await this.indexdbService.addItem(data);
        await this.commonService.showToast("Employee record has been added");
      }
      else {
        data.id = Number(this.route.snapshot.queryParamMap.get('id'));
        await this.indexdbService.updateItem(data);
        await this.commonService.showToast("Employee record has been updated");
      }
      this.cancel();
    }
    catch {
      await this.commonService.showToast("Something went wrong");
    }
  }

}
