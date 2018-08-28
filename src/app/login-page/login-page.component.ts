import { Component } from '@angular/core';
import {TablePageBasicComponent} from "../basic-components/table-page.basic.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent extends TablePageBasicComponent{
  submitUrl='http://yapi.youhujia.com/mock/42/demo/login';

  ngOnInit(): void {
    super.ngOnInit();
    console.log('LoginPageComponent.ngOnInit()');
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
}
