import { Component, inject, signal } from '@angular/core';
import { CreateFormGroupArgs, KENDO_GRID, KENDO_GRID_EXCEL_EXPORT, KENDO_GRID_PDF_EXPORT,SaveEvent } from '@progress/kendo-angular-grid';
import { ApiServicesService } from '../../services/api-services.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { fileExcelIcon,filePdfIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-edit-grid',
  standalone: true,
  imports: [KENDO_GRID,KENDO_GRID_EXCEL_EXPORT,KENDO_GRID_PDF_EXPORT,ReactiveFormsModule,DropDownsModule],
  templateUrl: './edit-grid.component.html',
  styleUrl: './edit-grid.component.css'
})
export class EditGridComponent {

  filePdfIcon: SVGIcon = filePdfIcon;
  fileExcelIcon: SVGIcon = fileExcelIcon;
  employees = signal<any[]>([])
  api=inject(ApiServicesService)
  fb = inject(FormBuilder)

  statusList = ["Pending","Completed","Due","Cancelled"]

  createFormGroup = (args:CreateFormGroupArgs):FormGroup =>{
    const item = args.isNew ? {} : args.dataItem;

    return this.fb.group({
      id:[item.id,[Validators.required, Validators.pattern('[0-9 ]*')]],
      name:[item.name,[Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      designation: [item.designation, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      department: [item.department, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      salary: [item.salary, [Validators.required, Validators.pattern('[0-9 ]*')]],
      status:[item.status]
    })
  }

  ngOnInit(){
    this.getAllEmployees()
  }

  // get all employees
  getAllEmployees(){
    this.api.exportEmployeeData().subscribe({
      next:(res:any)=>{
        this.employees.set(res)
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  // fn for changing the color of the status
  statusColor(status:string){
    let color;

    if (status == "Pending") {
      color = "#d6bc2a"
    } else if (status == "Completed") {
      color = "green"
    } else if (status == "Due"){
      color = "#E65100"
    }else if (status == "Cancelled"){
      color = "red"
    }else{
      color=""
    }

    return color;
  }

  // FN TO store data for excel export
  allData = ():ExcelExportData =>{
      return {data:this.employees()}
    }

    public saveHandler(args:SaveEvent):void{
    Object.assign(args.dataItem,args.formGroup.value)
  }
}


