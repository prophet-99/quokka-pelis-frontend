import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { PeliculasService } from 'src/app/services/facade.service';
import { Pelicula } from 'src/app/models/pelicula.model';
import { Actor } from '../../../models/actor.model';
import { Genero } from 'src/app/models/genero.model';

@Component({
  selector: 'app-pelicula-detalle-video',
  templateUrl: './pelicula-detalle-video.component.html',
  styleUrls: ['./pelicula-detalle-video.component.scss']
})
export class PeliculaDetalleVideoComponent implements OnInit {

  public pelicula: Pelicula = {
    nombre: '', sinopsis: '', url_poster: '',
    anio_lanzamiento: '', estudio: '', id: 0,
    url_video: ''
  };
  public actores$: Observable<Actor[]> = null;
  public generos$: Observable<Genero[]> = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private peliculaService: PeliculasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap( ({ id }) => this.peliculaService.findById(id) ),
        tap( ({ id }) => this.actores$ = this.peliculaService.findActores(id) ),
        tap( ({ id }) => this.generos$ = this.peliculaService.findGeneros(id) ),
        tap( (pelicula) => this.pelicula = pelicula )
      ).subscribe(
        (pelicula) => (!pelicula) ? this.router.navigateByUrl('/') : null
      );
  }

}
