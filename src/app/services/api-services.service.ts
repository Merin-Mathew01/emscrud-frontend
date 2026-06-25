import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  server_url = "http://localhost:3000"
  http = inject(HttpClient)

  getEmployeesAPI(searchText:any,page:number,limit:number){
    return this.http.get(`${this.server_url}/employees?search=${searchText}&page=${page}&limit=${limit}`)
  }

  addEmployeeAPI(body:any){
    return this.http.post(`${this.server_url}/employees`,body)
  }

  removeEmployeeAPI(id:any){
    return this.http.delete(`${this.server_url}/employee/${id}`)
  }

  getSingleEmployeeAPI(id:any){
    return this.http.get(`${this.server_url}/employee/${id}`)
  }

  updateEmployeeAPI(id:any,body:any){
    return this.http.put(`${this.server_url}/employee/${id}`,body)
  }

  searchEmployeeAPI(searchText:string){
    return this.http.get(`${this.server_url}/employees`)
  }

  paginatedEmployeeAPI(page:number,limit:number){
    return this.http.get(`${this.server_url}/employees?`)
  }


}
