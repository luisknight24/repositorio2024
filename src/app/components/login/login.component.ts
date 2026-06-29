import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Serán 3 vistas en el mismo componente: 'login' | 'registro' | 'verificar'
  vistaActual: string = 'login'; 
  
  formLogin!: FormGroup;
  formRegistro!: FormGroup;
  formVerificar!: FormGroup;

  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya tiene token, lo mandamos directo adentro
    if (this.authSvc.estaLogeado()) {
      this.router.navigate(['/gestion']);
    }

    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.formRegistro = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.formVerificar = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      codigo: ['', [Validators.required, Validators.maxLength(6)]]
    });
  }

  cambiarVista(nuevaVista: string): void {
    this.vistaActual = nuevaVista;
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  ejecutarLogin(): void {
    if (this.formLogin.invalid) return;
    this.cargando = true;
    this.mensajeError = '';

    this.authSvc.login(this.formLogin.value).subscribe({
      next: (res) => {
        this.cargando = false;
        // El interceptor y el guard ya hacen el resto. Lo mandamos a registros.
        this.router.navigate(['/gestion']); 
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error || 'Error al iniciar sesión. Revisa tus credenciales.';
      }
    });
  }

  ejecutarRegistro(): void {
    if (this.formRegistro.invalid) return;
    this.cargando = true;
    this.mensajeError = '';

    this.authSvc.registrar(this.formRegistro.value).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeExito = 'Registro exitoso. Te hemos enviado un código al correo.';
        // Pasamos el correo automáticamente al form de verificar
        this.formVerificar.patchValue({ correo: this.formRegistro.value.correo });
        this.cambiarVista('verificar');
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error || 'Ocurrió un error en el registro.';
      }
    });
  }

  ejecutarVerificacion(): void {
    if (this.formVerificar.invalid) return;
    this.cargando = true;
    this.mensajeError = '';

    this.authSvc.verificarCodigo(this.formVerificar.value).subscribe({
      next: (res) => {
        this.cargando = false;
        // Cambiamos la vista manualmente SIN limpiar el mensaje de éxito
        this.vistaActual = 'login'; 
        this.mensajeExito = 'Cuenta verificada correctamente. Ya puedes ingresar.';
        
        this.formLogin.patchValue({ correo: this.formVerificar.value.correo });
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error || 'Código incorrecto o cuenta ya verificada.';
      }
    });
  }
}
