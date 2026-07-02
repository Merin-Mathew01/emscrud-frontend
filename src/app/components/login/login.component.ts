import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServicesService } from '../../services/api-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder)
  loginForm:FormGroup
  api = inject(ApiServicesService)
  router=inject(Router)

  constructor(){
    this.loginForm = this.fb.group({
      username:['',[Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      password:['',[Validators.required, Validators.pattern('[a-zA-Z@!$#&0-9]*')]]
    })
  }

  login(){
    const data=this.loginForm.value
    if(this.loginForm.valid){
      this.api.loginAPI(data).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.router.navigateByUrl("/employees")
        },
        error:(error)=>{
          console.log(error);
          alert("Connection Failed")
        }
      })
    }
  }

}
