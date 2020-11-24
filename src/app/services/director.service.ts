import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DirectorRequest } from '../models/request/director.request';
import { Director } from '../models/director.model';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  private URL_API = `${ environment.baseApi }/director`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Director[]>{
    return this.httpClient.get<{ ok: boolean, directores: Director[] }>(
      this.URL_API
    ).pipe(
      map( ({ directores }) => directores )
    );
  }

  public save(directorRequest: DirectorRequest): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, directorRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteDirector(id: number): Observable<{ ok: boolean, msg: string }>{
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
