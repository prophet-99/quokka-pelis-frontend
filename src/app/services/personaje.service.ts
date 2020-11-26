import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PersonajeRequest } from '../models/request/personaje.request';
import { Personaje } from '../models/personaje.model';

@Injectable({
    providedIn: 'root'
  })
  export class PersonajeService {
  
    private URL_API = `${ environment.baseApi }/personaje`;
  
    constructor(private httpClient: HttpClient) { }
  
    public findAll(): Observable<Personaje[]>{
      return this.httpClient.get<{ ok: boolean, personajes: Personaje[] }>(
        this.URL_API
      ).pipe(
        map( ({ personajes }) => personajes )
      );
    }
  
    public findByWord(word: string): Observable<Personaje[]>{
      return this.httpClient.get<{ ok: boolean, personajes: Personaje[] }>(
        `${ this.URL_API }?word=${ word }`
      ).pipe(
        map( ({ personajes }) => personajes )
      );
    }
  
    public save(personajeRequest: PersonajeRequest): Observable<{ ok: boolean, msg: string }>{
      return this.httpClient.post<{ ok: boolean, msg: string }>(
        this.URL_API, personajeRequest
      ).pipe(
        catchError( ({ error }) => this.handleError(error) )
      );
    }
  
    public deletePersonaje(id: number): Observable<{ ok: boolean, msg: string }>{
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
  