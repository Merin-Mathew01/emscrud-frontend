import { Routes } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path:'employees',component:EmployeeComponent,title:"Employees"},
    {path:'',component:LoginComponent,title:"Login"}
];
