import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authSvc.obtenerToken();

    // Si hay token, clonamos la petición original y le inyectamos la cabecera
    if (token) {
      const reqClonada = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(reqClonada);
    }

    // Si no hay token, como podría ser en un login, la dejamos pasar normal
    return next.handle(request);
  }
}