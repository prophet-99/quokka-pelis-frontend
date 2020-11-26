import { Component, OnInit } from '@angular/core';

import { Observable, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

import { PeliculasService } from 'src/app/services/facade.service';
import { Pelicula } from 'src/app/models/pelicula.model';
import { Genero } from 'src/app/models/genero.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss']
})
export class PeliculasComponent implements OnInit {

  public peliculas: IPelicula[] = [];
  public formPelicula: FormGroup = null;

  constructor(
    private peliculaService: PeliculasService,
    private formBuilder: FormBuilder
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

    this.formPelicula = this.formBuilder.group({
      search: [ '' ]
    });

    this.formPelicula.get('search').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        tap( (_) => this.peliculas = [] ),
        mergeMap( (query) => this.peliculaService.findByName(query) ),
        mergeMap( (pelicula) => from(pelicula) ),
        mergeMap( (pelicula) =>
          this.peliculaService.findGeneros(pelicula.id)
            .pipe( map(gns => ({ ...pelicula, generos: gns })) )
        ),
      ).subscribe( (nPelicula) => this.peliculas.push(nPelicula) );
  }
}
interface IPelicula extends Pelicula {
  generos: Genero[];
}
