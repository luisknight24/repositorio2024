import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    public authSvc: AuthService, 
    private router: Router
  ) {}

  cerrarSesion(): void {
    this.authSvc.cerrarSesion(); // Borra el token y limpia la sesión.
    this.router.navigate(['/login']);
  }
}
