import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private toastCtrl = inject(ToastController);

  constructor() { }

  async showToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({
      header: message,
      color: 'dark',
      duration: duration
    });
    await toast.present();
  }

}

export type EmployeeData = {
  id?: number,
  employeeName: string,
  employeeRole: string,
  fromDate: string,
  toDate: string
}
