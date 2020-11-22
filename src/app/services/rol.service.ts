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
}
