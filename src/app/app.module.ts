import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {RegisterPageComponent} from './register-page/register-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {RouterModule} from "@angular/router";
import {TablePageBasicComponent} from "./basic-components/table-page.basic.component";
import {CustomRequestOptions} from "./services/http/custom-request-options.service";

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    LoginPageComponent,
    TablePageBasicComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ])
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomRequestOptions,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
