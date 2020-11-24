import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GeneroWithCantidad } from '../models/genero-with-cantidad.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private URL_API = `${ environment.baseApi }/genero`;

  constructor(private httpClient: HttpClient) { }

  public findAllWithCantidad(): Observable<GeneroWithCantidad[]>{
    return this.httpClient.get<{ ok: boolean, peliculas: GeneroWithCantidad[] }>(
      `${ environment.baseApi }/pelicula/NumMovies`
    ).pipe(
      map( ({ peliculas }) => peliculas )
    );
  }
}
