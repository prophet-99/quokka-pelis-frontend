import { Component, OnInit } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { PeliculasService } from 'src/app/services/facade.service';
import { Pelicula } from 'src/app/models/pelicula.model';
import { Genero } from 'src/app/models/genero.model';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss']
})
export class PeliculasComponent implements OnInit {

  public peliculas: IPelicula[] = [];

  constructor(
    private peliculaService: PeliculasService
  ) { }

  ngOnInit(): void {
    this.peliculaService.findAll()
      .pipe(
        mergeMap( (pelicula) => from(pelicula) ),
        mergeMap( (pelicula) =>
          this.peliculaService.findGeneros(pelicula.id)
            .pipe( map(gns => ({ ...pelicula, generos: gns })) )
        )
      ).subscribe( (nPelicula) => this.peliculas.push(nPelicula) );
  }

  public getGeneros(idPelicula: number): Observable<Genero[]>{
    return this.peliculaService.findGeneros(idPelicula);
  }
}
interface IPelicula extends Pelicula {
  generos: Genero[];
}
