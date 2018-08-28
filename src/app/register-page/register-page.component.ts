import { Component } from '@angular/core';
import {
  FormControl,
  Validators
} from '@angular/forms';
import {TablePageBasicComponent} from "../basic-components/table-page.basic.component";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',

  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent  extends TablePageBasicComponent {
  submitUrl='http://yapi.youhujia.com/mock/42/demo/register';

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email            : [ null, [ Validators.email ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      nickname         : [ null, [ Validators.required ] ],
      phoneNumberPrefix: [ '+86' ],
      phoneNumber      : [ null, [ Validators.required ] ],
      website          : [ null, [ Validators.required ] ],
      captcha          : [ null, [ Validators.required ] ],
      agree            : [ false ]
    });
  }
}
