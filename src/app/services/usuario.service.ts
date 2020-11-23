import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UsuarioRequest } from '../models/request/usuario.request';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL_API = `${ environment.baseApi }/usuario`;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Usuario[]>{
    return this.httpClient.get<{ ok: boolean, usuarios: Usuario[] }>(
      this.URL_API
    ).pipe(
      map( ({ usuarios }) => usuarios )
    );
  }

  public save(usuarioRequest: UsuarioRequest): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(
      this.URL_API, usuarioRequest
    ).pipe(
      catchError( ({ error }) => this.handleError(error) )
    );
  }

  public deleteById(idUsuario: number): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.delete<{ok: boolean, msg: string}>(
      `${ this.URL_API }/${ idUsuario }`
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
