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
import { PeliculaConfComponent } from './mantenimientos/pelicula-conf/pelicula-conf.component';
import { SerieConfComponent } from './mantenimientos/serie-conf/serie-conf.component';
import { UsuarioConfComponent } from './mantenimientos/usuario-conf/usuario-conf.component';
import { GeneroConfComponent } from './mantenimientos/genero-conf/genero-conf.component';
import { RolConfComponent } from './mantenimientos/rol-conf/rol-conf.component';
import { ActorConfComponent } from './mantenimientos/actor-conf/actor-conf.component';
import { PersonajeConfComponent } from './mantenimientos/personaje-conf/personaje-conf.component';
import { DirectorConfComponent } from './mantenimientos/director-conf/director-conf.component';
import { EstudioConfComponent } from './mantenimientos/estudio-conf/estudio-conf.component';
import { EpisodioConfComponent } from './mantenimientos/episodio-conf/episodio-conf.component';
import { TemporadaConfComponent } from './mantenimientos/temporada-conf/temporada-conf.component';

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
      { path: 'pagos', component: PagosComponent },
      { path: 'mantenimientos/usuarios', component: UsuarioConfComponent },
      { path: 'mantenimientos/generos', component: GeneroConfComponent },
      { path: 'mantenimientos/roles', component: RolConfComponent },
      { path: 'mantenimientos/peliculas', component: PeliculaConfComponent },
      { path: 'mantenimientos/series', component: SerieConfComponent },
      { path: 'mantenimientos/actores', component: ActorConfComponent },
      { path: 'mantenimientos/personajes', component: PersonajeConfComponent },
      { path: 'mantenimientos/directores', component: DirectorConfComponent },
      { path: 'mantenimientos/estudios', component: EstudioConfComponent },
      { path: 'mantenimientos/episodios', component: EpisodioConfComponent },
      { path: 'mantenimientos/temporadas', component: TemporadaConfComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
