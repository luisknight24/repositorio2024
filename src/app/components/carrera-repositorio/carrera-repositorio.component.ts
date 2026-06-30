import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositorioService, Publicacion } from '../../services/repositorio.service';

@Component({
  selector: 'app-carrera-repositorio',
  templateUrl: './carrera-repositorio.component.html',
  styleUrls: ['./carrera-repositorio.component.css']
})
export class CarreraRepositorioComponent implements OnInit {
  carreraId!: number;
  publicaciones: Publicacion[] = [];

  urlApiBase = 'https://repositorio-api-luis-egehd7dtc0aydmbp.eastus-01.azurewebsites.net/';

  constructor(
    private route: ActivatedRoute,
    private repositorioSvc: RepositorioService
  ) { }

  ngOnInit(): void {
    // Escuchamos los cambios en los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.carreraId = +idParam; // Conversión rápida a tipo numérico
        this.cargarPublicaciones();
      }
    });
  }

  private cargarPublicaciones(): void {
    this.repositorioSvc.obtenerPublicacionesPorCarrera(this.carreraId).subscribe({
      next: (data) => {
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('Error en la suscripción de publicaciones:', err);
      }
    });
  }
}
