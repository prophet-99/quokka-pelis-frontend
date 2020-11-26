import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { TemporadaRequest } from '../models/request/temporada.request';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class TemporadaService {

  private URL_API = `${ environment.baseApi }/temporada`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Season[]>{
    return this.httpClient.get<{ ok: boolean, temporadas: Season[] }>(
      this.URL_API
    ).pipe(
      map( ({ temporadas }) => temporadas )
    );
  }

  public findByWord(word: string): Observable<Season[]>{
    return this.httpClient.get<{ ok: boolean, temporadas: Season[] }>(
      `${ this.URL_API }?word=${ word }`
    ).pipe(
      map( ({ temporadas }) => temporadas )
    );
  }

  public save(temporadaRequest: FormData): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, temporadaRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteSeason(id: number): Observable<{ ok: boolean, msg: string }>{
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
