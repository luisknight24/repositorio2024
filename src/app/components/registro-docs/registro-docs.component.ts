import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepositorioService, Carrera } from '../../services/repositorio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-docs',
  templateUrl: './registro-docs.component.html',
  styleUrls: ['./registro-docs.component.css']
})
export class RegistroDocsComponent implements OnInit {
  vistaActual: 'lista' | 'formulario' = 'lista';
  listaDocumentos: any[] = [];
  cargandoLista = false;

  formRegistro!: FormGroup;
  listaCarreras: Carrera[] = [];
  archivoSeleccionado: File | null = null;
  enviando = false;
  mensajeExito = '';

  // Variables para edición
  modoEdicion = false;
  idEdicion: number | null = null;

  constructor(private fb: FormBuilder, private repoSvc: RepositorioService) { }

  ngOnInit(): void {
    this.cargarListaGestion();

    this.formRegistro = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(250)]],
      resumen: ['', Validators.required],
      doi: [''],
      autores: ['', Validators.required],
      urlExterno: [''],
      carreraId: ['', Validators.required]
    });

    this.repoSvc.obtenerCarreras().subscribe(data => this.listaCarreras = data);
  }

  cambiarVista(vista: 'lista' | 'formulario'): void {
    this.vistaActual = vista;
    this.mensajeExito = '';
    if (vista === 'lista') {
      this.modoEdicion = false;
      this.idEdicion = null;
      this.formRegistro.reset();
      this.archivoSeleccionado = null;
      this.cargarListaGestion();
    }
  }

  //Prepara el formulario con los datos viejos
  prepararEdicion(id: number): void {
    this.cargandoLista = true;
    this.repoSvc.obtenerPublicacionPorId(id).subscribe({
      next: (doc) => {
        this.modoEdicion = true;
        this.idEdicion = id;
        this.vistaActual = 'formulario';
        this.cargandoLista = false;

        this.formRegistro.patchValue({
          titulo: doc.titulo,
          resumen: doc.resumen,
          doi: doc.doi,
          // MODIFICADO: Unimos los autores con punto y coma y un espacio
          autores: doc.autores.join('; '),
          carreraId: this.listaCarreras.find(c => c.nombre === doc.carrera)?.id || ''
        });
      },
      error: () => {
        this.cargandoLista = false;
        alert('No se pudieron recuperar los detalles del documento.');
      }
    });
  }

  // Decide si guarda nuevo o actualiza existente
  guardarDocumento(): void {
    if (this.formRegistro.invalid) return;

    const link = this.formRegistro.get('urlExterno')?.value;

    // Si es nuevo, obligamos a que tenga un archivo adjunto
    if (!this.modoEdicion && !this.archivoSeleccionado && !link) {
      alert('Debes adjuntar un archivo PDF o ingresar un enlace externo.');
      return;
    }

    this.enviando = true;

    if (this.modoEdicion && this.idEdicion) {
      //Para editar mandamos un JSON con los textos modificados
      const datosActualizados = this.formRegistro.value;

      this.repoSvc.editarDocumento(this.idEdicion, datosActualizados).subscribe({
        next: () => {
          this.enviando = false;
          this.mensajeExito = 'Documento actualizado con éxito.';
          setTimeout(() => this.cambiarVista('lista'), 2000);
        },
        error: () => {
          this.enviando = false;
          alert('Error al actualizar el documento.');
        }
      });
    } else {

      const fd = new FormData();
      fd.append('Titulo', this.formRegistro.get('titulo')?.value);
      fd.append('Resumen', this.formRegistro.get('resumen')?.value);
      fd.append('Doi', this.formRegistro.get('doi')?.value || '');
      fd.append('Autores', this.formRegistro.get('autores')?.value);
      fd.append('CarreraId', this.formRegistro.get('carreraId')?.value);
      // fd.append('Archivo', this.archivoSeleccionado!);
      // fd.append('UrlExterno', link || '');

      // Adjuntamos el enlace (si está vacío, enviará un texto vacío)
      // if (this.archivoSeleccionado) {
      //   fd.append('Archivo', this.archivoSeleccionado);
      // }

      fd.append('UrlExterno', link || '');

      this.repoSvc.registrarDocumento(fd).subscribe({
        next: () => {
          this.enviando = false;
          this.mensajeExito = 'Documento registrado y subido correctamente.';
          setTimeout(() => this.cambiarVista('lista'), 2000);
        },
        error: () => {
          this.enviando = false;
          alert('Error al subir el documento.');
        }
      });
    }
  }

  cargarListaGestion(): void {
    this.cargandoLista = true;
    this.repoSvc.obtenerParaGestion().subscribe(data => {
      this.listaDocumentos = data;
      this.cargandoLista = false;
    });
  }

  eliminarDoc(id: number, titulo: string): void {
    // Confirmación antes de eliminar
    if (confirm(`¿Estás seguro de eliminar permanentemente "${titulo}"? El archivo PDF también será borrado del servidor.`)) {
      this.repoSvc.eliminarDocumento(id).subscribe({
        next: () => {
          // Filtramos la lista localmente para no hacer otra petición a la base de datos
          this.listaDocumentos = this.listaDocumentos.filter(d => d.id !== id);
        },
        error: () => alert('Ocurrió un error al intentar eliminar el documento.')
      });
    }
  }

  alSeleccionarArchivo(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivoSeleccionado = file;
    } else {
      this.archivoSeleccionado = null;
      alert('Selecciona un archivo PDF.');
      event.target.value = '';
    }
  }

  // guardarDocumento(): void {
  //   if (this.formRegistro.invalid || !this.archivoSeleccionado) return;
  //   this.enviando = true;

  //   const fd = new FormData();
  //   fd.append('Titulo', this.formRegistro.get('titulo')?.value);
  //   fd.append('Resumen', this.formRegistro.get('resumen')?.value);
  //   fd.append('Doi', this.formRegistro.get('doi')?.value || '');
  //   fd.append('Autores', this.formRegistro.get('autores')?.value);
  //   fd.append('CarreraId', this.formRegistro.get('carreraId')?.value);
  //   fd.append('Archivo', this.archivoSeleccionado);

  //   this.repoSvc.registrarDocumento(fd).subscribe({
  //     next: () => {
  //       this.enviando = false;
  //       this.mensajeExito = 'Documento registrado y subido correctamente.';
  //       this.formRegistro.reset();
  //       this.archivoSeleccionado = null;

  //       setTimeout(() => this.cambiarVista('lista'), 2000);
  //     },
  //     error: () => {
  //       this.enviando = false;
  //       alert('Error al subir el documento.');
  //     }
  //   });
  // }
}
