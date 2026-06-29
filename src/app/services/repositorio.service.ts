import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Carrera {
  id: number;
  nombre: string;
  descripcion: string;
}

// Para tipar las publicaciones de la API
export interface Publicacion {
  id: number;
  titulo: string;
  fechaPublicacion: string;
  autores: string[];
  resumen?: string;
  doi?: string;
  carrera?: string;
  urlExterno?: string;
  archivoUrl?: string;
  archivoNombre?: string;
  archivoTamano?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RepositorioService {
  
  private apiUrl = 'https://localhost:7073/api';
  
  constructor(private http: HttpClient) { }

  obtenerCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras`).pipe(
      catchError(err => {
        console.error('Fallo de conexión al cargar carreras:', err);
        return of([]); 
      })
    );
  }

  //Método para consumir el controlador de .NET
  obtenerPublicacionesPorCarrera(carreraId: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones/carrera/${carreraId}`).pipe(
      catchError(err => {
        console.error(`Error al recuperar publicaciones para la carrera ${carreraId}:`, err);
        return of([]);
      })
    );
  }

  // Método para registrar una nueva publicación con su archivo PDF
  registrarDocumento(datosFormulario: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicaciones/registrar`, datosFormulario).pipe(
      catchError(err => {
        console.error('Fallo al registrar el documento en el servidor:', err);
        throw err;
      })
    );
  }

  // Método para buscar documentos por término libre
  buscarDocumentos(termino: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones/buscar?termino=${termino}`).pipe(
      catchError(err => {
        console.error('Error al realizar la búsqueda:', err);
        return of([]);
      })
    );
  }

  obtenerPublicacionPorId(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/publicaciones/${id}`).pipe(
      catchError(err => {
        console.error(`Error al recuperar el documento ${id}:`, err);
        throw err;
      })
    );
  }

  // Obtener lista completa
  obtenerParaGestion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones/gestion`).pipe(
      catchError(err => {
        console.error('Error al obtener lista de gestión:', err);
        return of([]);
      })
    );
  }

  // Eliminar documento
  eliminarDocumento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/publicaciones/eliminar/${id}`).pipe(
      catchError(err => {
        console.error(`Error al eliminar documento ${id}:`, err);
        throw err;
      })
    );
  }

  // Actualizar datos de una publicación
  editarDocumento(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/publicaciones/editar/${id}`, datos).pipe(
      catchError(err => {
        console.error(`Error al editar el documento ${id}:`, err);
        throw err;
      })
    );
  }

  // Obtener estadísticas globales para la página de inicio
  obtenerMetricasGlobales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/publicaciones/metricas`).pipe(
      catchError(err => {
        console.error('Fallo al recuperar métricas institucionales:', err);
        // Retornamos un objeto por defecto a cero, en caso que la interfaz se vuelva loca jaja.
        return of({ totalDocumentos: 0, totalAutores: 0, totalCarreras: 0, totalUsuarios: 0 });
      })
    );
  }
}
