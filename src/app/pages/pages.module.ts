import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
import { PeliculaConfComponent } from './mantenimientos/pelicula-conf/pelicula-conf.component';
import { SerieConfComponent } from './mantenimientos/serie-conf/serie-conf.component';
import { UsuarioConfComponent } from './mantenimientos/usuario-conf/usuario-conf.component';
import { GeneroConfComponent } from './mantenimientos/genero-conf/genero-conf.component';
import { RolConfComponent } from './mantenimientos/rol-conf/rol-conf.component';
import { ActorConfComponent } from './mantenimientos/actor-conf/actor-conf.component';
import { DirectorConfComponent } from './mantenimientos/director-conf/director-conf.component';
import { EstudioConfComponent } from './mantenimientos/estudio-conf/estudio-conf.component';
import { PersonajeConfComponent } from './mantenimientos/personaje-conf/personaje-conf.component';
import { EpisodioConfComponent } from './mantenimientos/episodio-conf/episodio-conf.component';
import { TemporadaConfComponent } from './mantenimientos/temporada-conf/temporada-conf.component';


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
    HomeComponent,
    PeliculaConfComponent,
    SerieConfComponent,
    UsuarioConfComponent,
    GeneroConfComponent,
    RolConfComponent,
    ActorConfComponent,
    DirectorConfComponent,
    EstudioConfComponent,
    PersonajeConfComponent,
    EpisodioConfComponent,
    TemporadaConfComponent
  ],  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PagesModule { }
