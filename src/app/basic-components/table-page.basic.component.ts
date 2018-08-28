import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  template: ''
})
export class TablePageBasicComponent {
  validateForm: FormGroup; // 存放实例化后的 FormGroup
  submitUrl: string = ''; // 存放 submit 方法的 url ，子类可以对其重写

  constructor(public fb: FormBuilder, public http: HttpClient) { // 基类的构造函数，将所有的类依赖以 public 的方式注入，以供子类访问
  }

  ngOnInit(): void { // 基类 ngOnInit 方法
    console.log('TablePageBasicComponent.ngOnInit()');
  }

  submitForm(): void { // 基类 submitForm 方法
    console.log('TablePageBasicComponent.submitForm()');
    console.log(this.validateForm.value);
    this.http.post(this.submitUrl,this.validateForm.value).subscribe(resp => {
      console.log(resp)
    });
  }
}
