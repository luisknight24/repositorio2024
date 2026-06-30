import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RepositorioService, Publicacion } from '../../services/repositorio.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  cajaBusqueda = new FormControl('');
  resultados: Publicacion[] = [];
  buscando = false;
  busquedaRealizada = false;
  
  urlApiBase = 'https://repositorio-api-luis-egehd7dtc0aydmbp.eastus-01.azurewebsites.net'; 

  constructor(private repoSvc: RepositorioService) {}

  ngOnInit(): void {
    //Escuchamos lo que el usuario escribe en vivo
    this.cajaBusqueda.valueChanges.pipe(
      debounceTime(500), // Espera 500ms después de la última tecla
      distinctUntilChanged() // Solo busca si el término realmente cambió
    ).subscribe(termino => {
      this.ejecutarBusqueda(termino || '');
    });
  }

  ejecutarBusqueda(termino: string): void {
    if (!termino.trim()) {
      this.resultados = [];
      this.busquedaRealizada = false;
      return;
    }

    this.buscando = true;
    this.busquedaRealizada = true;

    this.repoSvc.buscarDocumentos(termino).subscribe({
      next: (res) => {
        this.resultados = res;
        this.buscando = false;
      },
      error: () => {
        this.buscando = false;
        this.resultados = [];
      }
    });
  }
}
