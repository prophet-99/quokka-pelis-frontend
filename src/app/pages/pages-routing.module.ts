import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { PeliculasComponent } from './peliculas/peliculas.component';
import { SeriesComponent } from './series/series.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PagosComponent } from './pagos/pagos.component';
import { SerieDetalleComponent } from './series/serie-detalle/serie-detalle.component';
import {
    PeliculaDetalleVideoComponent
} from './peliculas/pelicula-detalle-video/pelicula-detalle-video.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',
    component: PagesComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'peliculas', component: PeliculasComponent },
      { path: 'peliculas/:id', component: PeliculaDetalleVideoComponent },
      { path: 'series', component: SeriesComponent },
      { path: 'series/:id', component: SerieDetalleComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'pagos', component: PagosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
