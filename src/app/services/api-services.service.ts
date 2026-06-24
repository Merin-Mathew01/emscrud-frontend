import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  server_url = "http://localhost:3000"
  http = inject(HttpClient)

  getEmployees(){
    return this.http.get(`${this.server_url}/employees`)
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


}
