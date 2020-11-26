import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { GeneroRequest } from '../models/request/genero.request';
import { Genero } from '../models/genero.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private URL_API = `${ environment.baseApi }/genero`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Genero[]>{
    return this.httpClient.get<{ ok: boolean, generos: Genero[] }>(
      this.URL_API
    ).pipe(
      map( ({ generos }) => generos )
    );
  }

  public findByWord(word: string): Observable<Genero[]>{
    return this.httpClient.get<{ ok: boolean, generos: Genero[] }>(
      `${ this.URL_API }?word=${ word }`
    ).pipe(
      map( ({ generos }) => generos )
    );
  }

  public save(generoRequest: GeneroRequest): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, generoRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteGender(id: number): Observable<{ ok: boolean, msg: string }>{
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
