import { Component, inject, signal } from '@angular/core';
import { ApiServicesService } from '../../services/api-services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  fb = inject(FormBuilder)
  api = inject(ApiServicesService)
  employees = signal<any[]>([])
  employeeForm: FormGroup
  editId: any = null

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
    this.getAllEmployees()
  }

  getAllEmployees() {
    this.api.getEmployees().subscribe({
      next: (res: any) => {
        this.employees.set(res)
        console.log(this.employees());
      },
      error: (reason: any) => {
        console.log(reason);
      }
    })
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
        this.getAllEmployees()
      },
      error: (err) => {
        console.log(err);
      }
    })
  }



  deleteEmployee(id: any) {
    this.api.removeEmployeeAPI(id).subscribe(() => {
      console.log("employee deleted");
      this.getAllEmployees()
    })

  }


}
