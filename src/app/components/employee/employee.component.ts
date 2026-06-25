import { Component, inject, signal } from '@angular/core';
import { ApiServicesService } from '../../services/api-services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { GridDataResult, KENDO_GRID } from "@progress/kendo-angular-grid";
import {  debounceTime, Subject } from 'rxjs';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule,KENDO_TEXTBOX,KENDO_GRID,ButtonsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  fb = inject(FormBuilder)
  api = inject(ApiServicesService)
  employees = signal<any[]>([])
  employeeForm: FormGroup
  editId: any = null
  searchText = new Subject<string>()
  skip=0
  pageSize=10
  gridData = signal<GridDataResult>({
    data:[],
    total:0
  })

  constructor() {
    this.employeeForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      designation: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      department: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      salary: ['', [Validators.required, Validators.pattern('[0-9 ]*')]]
    })
  }

  ngOnInit() {
    // this.getAllEmployees()
    // this.searchEmployee()
    this.loadEmployees()
    this.searchText.next('')
  }

  // getAllEmployees() {
  //    const page = this.skip/this.pageSize + 1  
  //   this.api.getEmployeesAPI(this.searchText,page,this.pageSize).subscribe({
  //     next: (res: any) => {
  //       this.gridData.set({
  //       data:res.employees,
  //       total:res.total
  //     })
  //     },
  //     error: (reason: any) => {
  //       console.log(reason);
  //     }
  //   })
  // }

  // searchEmployee(){
  //   this.searchText.pipe(debounceTime(500)).subscribe((value)=>{
  //     this.api.searchEmployeeAPI(value).subscribe((res:any)=>{
  //       this.employees.set(res)
  //     })
  //   })
  // }

  loadEmployees(){
    const page = this.skip/this.pageSize + 1    
    this.searchText.pipe(debounceTime(500)).subscribe((value)=>{
      console.log(value);
    
      this.api.getEmployeesAPI(value,page,this.pageSize).subscribe((res:any)=>{
        this.gridData.set({
        data:res.employees,
        total:res.total
      })
      })
    })
    
  }

  search(event:any){
    
    this.searchText.next(event.target.value)
    this.skip=0
    this.loadEmployees()
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      this.api.addEmployeeAPI(this.employeeForm.value).subscribe({
        next: (res: any) => {
          this.employees.set(res)
          alert("Employee Added Successfully...")
          this.employeeForm.reset()
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  saveEmployee() {
    if (this.editId) {
      this.updateEmployee()
    } else {
      this.addEmployee()
    }
  }

  getEmployeeDetails(id: any) {
    this.editId = id
    this.api.getSingleEmployeeAPI(id).subscribe((res: any) => {
      this.employeeForm.setValue({
        id: res.id,
        name: res.name,
        designation: res.designation,
        department: res.department,
        salary: res.salary
      })

    })
  }

  updateEmployee() {
    this.api.updateEmployeeAPI(this.editId, this.employeeForm.value).subscribe({
      next: (res: any) => {
        alert("Employee Updated Successfully...")
        this.employeeForm.reset()
        
        this.editId=null
        // this.getAllEmployees()
        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  deleteEmployee(id: any) {
    this.api.removeEmployeeAPI(id).subscribe(() => {
      console.log("employee deleted");
      // this.getAllEmployees()
    })

  }

  

  pageChange(event:PageChangeEvent){
    this.skip = event.skip
    this.loadEmployees()
  }


}
