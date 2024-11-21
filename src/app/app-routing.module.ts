import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    pathMatch: 'full'
  },
  {
    path: 'employee-list',
    loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'add-employee-details',
    loadComponent: () => import('./add-employee-details/add-employee-details.component').then(m => m.AddEmployeeDetailsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
