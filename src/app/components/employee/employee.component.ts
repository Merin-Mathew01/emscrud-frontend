import { Component, inject, signal } from '@angular/core';
import { ApiServicesService } from '../../services/api-services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { GridDataResult, KENDO_GRID } from "@progress/kendo-angular-grid";
import { debounceTime, Subject } from 'rxjs';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, KENDO_TEXTBOX, KENDO_GRID, ButtonsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  fb = inject(FormBuilder)
  api = inject(ApiServicesService)
  // employees = signal<any[]>([])
  employeeForm: FormGroup
  editId: any = null
  searchText = new Subject<string>()
  currentSearchText = ''
  skip = 0
  pageSize = 10
  gridData = signal<GridDataResult>({
    data: [],
    total: 0
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
    // listen for search input with debounce
    this.searchText.pipe(debounceTime(300)).subscribe((value) => {
      console.log(value);
      // store latest seach value
      this.currentSearchText = value
      // rest first page after search
      this.skip = 0
      this.loadEmployees()
    })
    // this.getAllEmployees()
    // this.searchEmployee()

    // loads employee list initially
    this.loadEmployees()
  }

  // get all emplyees for displaying in table
  // getAllEmployees() {
  //   this.api.getEmployeesAPI().subscribe({
  //     next: (res: any) => {
  //       this.employees.set(res)
  //     },
  //     error: (reason: any) => {
  //       console.log(reason);
  //     }
  //   })
  // }

  // search in table
  // searchEmployee(){
  //   this.searchText.pipe(debounceTime(500)).subscribe((value)=>{
  //     this.api.searchEmployeeAPI(value).subscribe((res:any)=>{
  //       this.employees.set(res)
  //     })
  //   })
  // }

  // load employees with search and pagination
  loadEmployees() {
    const page = this.skip / this.pageSize + 1
    this.api.getEmployeesAPI(this.currentSearchText, page, this.pageSize).subscribe((res: any) => {
      console.log("Response", res);
      this.gridData.set({
        data: res.employees,
        total: res.total
      })
    })


  }

  // send typed value to searchText subject
  search(event: any) {
    this.searchText.next(event.target.value)
  }

  // addemployee function 
  addEmployee() {
    if (this.employeeForm.valid) {
      this.api.addEmployeeAPI(this.employeeForm.value).subscribe({
        next: (res: any) => {
          this.gridData.set(res)
          // this.employees.set(res)
          alert("Employee Added Successfully...")
          this.employeeForm.reset()
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  // function to call update or add function according to id
  saveEmployee() {
    if (this.editId) {
      this.updateEmployee()
    } else {
      this.addEmployee()
    }
  }

  // get single employee details and set it to the form
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

  // update employee
  updateEmployee() {
    this.api.updateEmployeeAPI(this.editId, this.employeeForm.value).subscribe({
      next: (res: any) => {
        alert("Employee Updated Successfully...")
        this.loadEmployees()
        this.employeeForm.reset()
        this.editId = null
        // this.getAllEmployees()
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // delete employee
  deleteEmployee(id: any) {
    this.api.removeEmployeeAPI(id).subscribe(() => {
      console.log("employee deleted");
      // this.getAllEmployees()
      this.loadEmployees()
    })
  }

  // fn to update the skip value when page changes and load the selected page
  pageChange(event: PageChangeEvent) {
    this.skip = event.skip
    this.loadEmployees()
  }


}
