import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ActorRequest } from '../models/request/actor.request';
import { Actor } from '../models/actor.model';

@Injectable({
    providedIn: 'root'
  })
  export class ActorService {
  
    private URL_API = `${ environment.baseApi }/actor`;
  
    constructor(private httpClient: HttpClient) { }
  
    public findAll(): Observable<Actor[]>{
      return this.httpClient.get<{ ok: boolean, actores: Actor[] }>(
        this.URL_API
      ).pipe(
        map( ({ actores }) => actores )
      );
    }
  
    public findByWord(word: string): Observable<Actor[]>{
      return this.httpClient.get<{ ok: boolean, actores: Actor[] }>(
        `${ this.URL_API }?word=${ word }`
      ).pipe(
        map( ({ actores }) => actores )
      );
    }
  
    public save(actorRequest: ActorRequest): Observable<{ ok: boolean, msg: string }>{
      return this.httpClient.post<{ ok: boolean, msg: string }>(
        this.URL_API, actorRequest
      ).pipe(
        catchError( ({ error }) => this.handleError(error) )
      );
    }
  
    public deleteActor(id: number): Observable<{ ok: boolean, msg: string }>{
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
  