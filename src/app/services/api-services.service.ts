import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  server_url = "http://localhost:3000"
  http = inject(HttpClient)

  // get employee list with search and pagination
  getEmployeesAPI(searchText:any,page:number,limit:number){
    return this.http.get(`${this.server_url}/employees?search=${searchText}&page=${page}&limit=${limit}`)
  }

  // add employee api
  addEmployeeAPI(body:any){
    return this.http.post(`${this.server_url}/employees`,body)
  }

  // delete employee api
  removeEmployeeAPI(id:any){
    return this.http.delete(`${this.server_url}/employee/${id}`)
  }

  // get a single employee details api
  getSingleEmployeeAPI(id:any){
    return this.http.get(`${this.server_url}/employee/${id}`)
  }

  // update employee api
  updateEmployeeAPI(id:any,body:any){
    return this.http.put(`${this.server_url}/employee/${id}`,body)
  }

  // search employee api
  // searchEmployeeAPI(searchText:string){
  //   return this.http.get(`${this.server_url}/employees`)
  // }


}
