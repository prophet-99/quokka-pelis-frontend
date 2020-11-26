import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Serie } from '../models/serie.model';
import { Genero } from '../models/genero.model';
import { Actor } from '../models/actor.model';
import { Director } from '../models/director.model';
import { Capitulo } from '../models/capitulo.model';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private URL_API = `${ environment.baseApi }/serie`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Serie[]>{
    return this.httpClient.get<{ ok: boolean, serie: Serie[] }>(
      `${ this.URL_API }`
    ).pipe(
      map( ({ serie }) => serie )
    );
  }

  public findDirectors(idSerie: number): Observable<Director[]>{
    return this.httpClient.get<{ ok: boolean, serie: Director[] }>(
      `${ this.URL_API }/Directors?id=${ idSerie }`
    ).pipe(
      map( ({ serie }) => serie )
    );
  }

  public findGeneros(idSerie: number): Observable<Genero[]>{
    return this.httpClient.get<{ ok: boolean, serie: Genero[] }>(
      `${ this.URL_API }?id=${ idSerie }`
    ).pipe(
      map( ({ serie }) => serie )
    );
  }

  public findById(idSerie: number): Observable<Serie>{
    return this.httpClient.get<{ ok: boolean, serie: Serie[] }>(
      `${ this.URL_API }`
    ).pipe(
      map( ({ serie }) => serie.find( ({ id }) => idSerie == id ) )
    );
  }

  public findByName(query: string): Observable<Serie[]>{
    return this.httpClient.get<{ ok: boolean, serie: Serie[] }>(
      `${ this.URL_API }?filter=${ query }`
    ).pipe(
      map( ({ serie }) => serie )
    );
  }

  public findSeasons(idSerie: number): Observable<Season[]>{
    return this.httpClient.get<{ ok: boolean, serie: Season[] }>(
      `${ this.URL_API }/Season?id=${ idSerie }`
    ).pipe(
      map( ({ serie }) => serie )
    );
  }

  public findCapitulosBySeason(idTemporada: number): Observable<Capitulo[]>{
    return this.httpClient.get<{ ok: boolean, capitulo: Capitulo[] }>(
      `${ environment.baseApi }/capitulo?id=${ idTemporada }`
    ).pipe(
      map( ({ capitulo }) => capitulo )
    );
  }

  public save(serieRequest: FormData): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, serieRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteSerie(id: number): Observable<{ ok: boolean, msg: string }>{
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
