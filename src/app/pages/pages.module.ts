import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PeliculasComponent } from './peliculas/peliculas.component';
import { SeriesComponent } from './series/series.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PagosComponent } from './pagos/pagos.component';
import { SerieDetalleComponent } from './series/serie-detalle/serie-detalle.component';
import { SerieDetalleVideoComponent } from './series/serie-detalle-video/serie-detalle-video.component';
import { PeliculaDetalleVideoComponent } from './peliculas/pelicula-detalle-video/pelicula-detalle-video.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    PagesComponent,
    PeliculasComponent,
    SeriesComponent,
    PerfilComponent,
    PagosComponent,
    SerieDetalleComponent,
    SerieDetalleVideoComponent,
    PeliculaDetalleVideoComponent,
    HomeComponent
  ],  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
