import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private URL_API = `${ environment.baseApi }/rol`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Rol[]>{
    return this.httpClient.get<{ ok: boolean, roles: Rol[] }>(
      this.URL_API
    ).pipe(
      map( ({ roles }) => roles )
    );
  }

  public save(id: number, descripcion: string): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, { id, descripcion }
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteById(idRol: number): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.delete<{ok: boolean, msg: string}>(
      `${ this.URL_API }/${ idRol }`
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
