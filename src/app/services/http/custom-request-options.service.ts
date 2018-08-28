import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CustomRequestOptions implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clone = req.clone({
      setHeaders: {
        'Authorization': localStorage.token || '',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE,PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With',
        'Content-Type': 'application/json',
        'crossDomain': 'true'
      }
    });
    return next.handle(clone);
  }
}
