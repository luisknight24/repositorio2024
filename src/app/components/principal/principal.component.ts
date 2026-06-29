import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepositorioService, Carrera } from '../../services/repositorio.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  
  carrerasDisponibles: Carrera[] = [];
  
  // Con esto almacenamos los contadores del panel superior
  datosMetricas = {
    totalDocumentos: 0,
    totalAutores: 0,
    totalCarreras: 0,
    totalUsuarios: 0
  };

  constructor(
    private router: Router,
    private repositorioSvc: RepositorioService
  ) { }

  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarEstadisticas();
  }

  cargarCarreras(): void {
    this.repositorioSvc.obtenerCarreras().subscribe({
      next: (data) => {
        this.carrerasDisponibles = data;
      }
    });
  }

  //Carga las métricas de la API
  cargarEstadisticas(): void {
    this.repositorioSvc.obtenerMetricasGlobales().subscribe({
      next: (res) => {
        this.datosMetricas = res;
      }
    });
  }
}
