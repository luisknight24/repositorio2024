import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://repositorio-api-luis-egehd7dtc0aydmbp.eastus-01.azurewebsites.net/api';
  private tokenKey = 'jwt_repo_istlc';

  constructor(private http: HttpClient) { }

  registrar(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  verificarCodigo(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar`, datos);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      // 'tap' nos permite ejecutar código secundario sin alterar la respuesta
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
        }
      })
    );
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  estaLogeado(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
