import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from './components/principal/principal.component';
// import { Subtema1Component } from './components/subtema1/subtema1.component';
// import { Subtema2Component } from './components/subtema2/subtema2.component';
// import { Subtema3Component } from './components/subtema3/subtema3.component';
// import { Subtema4Component } from './components/subtema4/subtema4.component';
import { CarreraRepositorioComponent } from './components/carrera-repositorio/carrera-repositorio.component';
// import { ResultadosComponent } from './components/resultados/resultados.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { PublicacionesEncontradasComponent } from './components/publicaciones-encontradas/publicaciones-encontradas.component';
import { InformacionDocumentoComponent } from './components/informacion-documento/informacion-documento.component';
import { RegistroDocsComponent } from './components/registro-docs/registro-docs.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { SeguridadGuard } from './guards/seguridad.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:'', redirectTo: 'PrincipalComponent', pathMatch: 'full'},
  { path: 'inicio', component: PrincipalComponent },
  // { path: 'subtema1', component: Subtema1Component },
  // { path: 'subtema2', component: Subtema2Component },
  // { path: 'subtema3', component: Subtema3Component },
  // { path: 'subtema4', component: Subtema4Component },
  // Reemplazo de subtema1, 2, 3 y 4 por una única ruta parametrizada
  { path: 'carrera/:id', component: CarreraRepositorioComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'gestion', component: RegistroDocsComponent, canActivate: [SeguridadGuard] },
  { path: 'login', component: LoginComponent },
  // { path: 'noencontrado', component: NoEncontradoComponent},
  // { path: 'publicacionesencontradas', component: PublicacionesEncontradasComponent},
  { path: 'documento/:id', component: InformacionDocumentoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
