import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadGuard implements CanActivate {

  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authSvc.estaLogeado()) {
      return true;
    }
    
    // Si no está logeado, lo mandamos a la futura pantalla de login
    this.router.navigate(['/login']);
    return false;
  }
}
