import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositorioService, Publicacion } from '../../services/repositorio.service';

@Component({
  selector: 'app-informacion-documento',
  templateUrl: './informacion-documento.component.html',
  styleUrls: ['./informacion-documento.component.css']
})
export class InformacionDocumentoComponent implements OnInit {
  docId!: number;
  docInfo: Publicacion | null = null;
  cargando = true;
  errorCarga = false;

  urlApiBase = 'https://localhost:7073/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repoSvc: RepositorioService
  ) { }

  ngOnInit(): void {
    // Leemos el ID que viene en la ruta: /informaciondocumento/3
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.docId = +idStr;
        this.cargarDetalles();
      } else {
        // Si no hay ID, lo mandamos al inicio por seguridad
        this.router.navigate(['/inicio']);
      }
    });
  }

  cargarDetalles(): void {
    this.cargando = true;
    this.repoSvc.obtenerPublicacionPorId(this.docId).subscribe({
      next: (data) => {
        this.docInfo = data;
        this.cargando = false;
      },
      error: () => {
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  volverAtras(): void {
    window.history.back();
  }
}
