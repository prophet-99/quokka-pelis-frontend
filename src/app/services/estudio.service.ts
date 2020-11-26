import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EstudioRequest } from '../models/request/estudio.request';
import { Estudio } from '../models/estudio.model';

@Injectable({
  providedIn: 'root'
})
export class EstudioService {

  private URL_API = `${ environment.baseApi }/estudio`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Estudio[]>{
    return this.httpClient.get<{ ok: boolean, estudios: Estudio[] }>(
      this.URL_API
    ).pipe(
      map( ({ estudios }) => estudios )
    );
  }

  public findByWord(word: string): Observable<Estudio[]>{
    return this.httpClient.get<{ ok: boolean, estudios: Estudio[] }>(
      `${ this.URL_API }?word=${ word }`
    ).pipe(
      map( ({ estudios }) => estudios )
    );
  }

  public save(estudioRequest: EstudioRequest): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, estudioRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteEstudio(id: number): Observable<{ ok: boolean, msg: string }>{
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
