import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PagoRequest } from '../models/request/pago.request';
import { ReportePagos } from '../models/reporte-pagos.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private URL_API = `${ environment.baseApi }/pago`;

  constructor(private httpClient: HttpClient) { }

  public persistPago(pagoRequest: PagoRequest): Observable<{ ok: boolean, msg: string }>{
    return this.httpClient.post<{ ok: boolean, msg: string }>(this.URL_API, pagoRequest);
  }

  public getBoletaByUsuario(idUsuario: number): Observable<ReportePagos[]>{
    return this.httpClient.get<{ ok: boolean, Boleta: ReportePagos[] }>(`
      ${ this.URL_API }/reporte?idUsu=${ idUsuario }`
    ).pipe(
      map( ({ Boleta }) => Boleta )
    );
  }
}
