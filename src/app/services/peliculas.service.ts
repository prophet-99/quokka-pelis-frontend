import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Pelicula } from '../models/pelicula.model';
import { Actor } from '../models/actor.model';
import { Genero } from '../models/genero.model';

import { PeliculaRequest } from '../models/request/pelicula.request';


@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private URL_API = `${ environment.baseApi }/pelicula`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Pelicula[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      this.URL_API
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findActores(idPelicula: number): Observable<Actor[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Actor[] }>(
      `${ this.URL_API }/Actors?id=${ idPelicula }`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findByWord(word: string): Observable<Pelicula[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      `${ this.URL_API }?word=${ word }`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findGeneros(idPelicula: number): Observable<Genero[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Genero[] }>(
      `${ this.URL_API }?id=${ idPelicula }`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public findById(idPelicula: number): Observable<Pelicula>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      `${ this.URL_API }`
    ).pipe(
      map( ({ peliculas }) => peliculas.find( ({ id }) => idPelicula == id ) )
    );
  }

  public findByName(query: string): Observable<Pelicula[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: Pelicula[] }>(
      `${ this.URL_API }?word=${ query }`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }

  public save(peliculaRequest: FormData): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, peliculaRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deletePelicula(id: number): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.delete<{ok: boolean, msg: string}>(
      `${ this.URL_API }/${ id }`
    );
  }

  private handleError(error): Observable<ErrorType>{
    if (error.errors)
      return throwError({ ok: false, msg: 'Error de request', codeError: -1 });
    else{
      const err = error.msg.originalError.info;
      return throwError({ ok: false, msg: err.message, codeError: err.number });
    }
  }

}
type ErrorType = { ok: boolean, msg: string, codeError: number };
