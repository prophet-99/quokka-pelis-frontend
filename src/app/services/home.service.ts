import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GeneroWithCantidad } from '../models/genero-with-cantidad.model';
import { Pelicula } from '../models/pelicula.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  public findGenerosWithCantidad(): Observable<GeneroWithCantidad[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: GeneroWithCantidad[] }>(
      `${ environment.baseApi }/pelicula/NumMovies`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findPeliculasEstreno(): Observable<Pelicula[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      `${ environment.baseApi }/pelicula/Estrenos`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findTop3PeliculasEstreno(): Observable<Pelicula[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      `${ environment.baseApi }/pelicula/Estrenos`
    ).pipe(
      map( ({ peliculas }) => [ peliculas[0], peliculas[1], peliculas[2] ] )
    );
  }
}
