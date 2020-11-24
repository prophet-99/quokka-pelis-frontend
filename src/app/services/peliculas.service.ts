import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private URL_API = `${ environment.baseApi }/pelicula`;

  constructor(private httpClient: HttpClient) { }

  

}

type ErrorType = { ok: boolean, msg: string, codeError: number };
