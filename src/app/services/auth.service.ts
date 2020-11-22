import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthRequest } from '../models/request/auth.request';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_API = `${ environment.baseApi }/auth`;
  public userAuth: User = null;

  constructor(private httpClient: HttpClient) { }

  public loginUser(authRequest: AuthRequest): Observable<{ ok: boolean, usuario: User }>{
    return this.httpClient.post<{ ok: boolean, usuario: User }>(
      `${ this.URL_API }`, authRequest
    ).pipe(
      tap( ({ ok, usuario }) => {
        if (ok) {
          this.userAuth = new User(
            usuario.id, usuario.correo, usuario.nombres,
            usuario.apellidos, usuario.telefono, usuario.id_rol,
            usuario.genero);
          localStorage.setItem('QUOKKA_AUTH', JSON.stringify(this.userAuth));
        }
      })
    );
  }

  public handleListenerAuth(): void{
    if (localStorage.getItem('QUOKKA_AUTH')){
      const cUser = JSON.parse(localStorage.getItem('QUOKKA_AUTH'));
      this.userAuth = new User(
        cUser.id, cUser.correo, cUser.nombres,
        cUser.apellidos, cUser.telefono, cUser.id_rol,
        cUser.genero
      );
    } else this.userAuth = null;
  }

  public handleGetRemember(): { correo: string, secretPhrase: string }{
    return (localStorage.getItem('QUOKKA_REMEMBER')) ?
    JSON.parse( localStorage.getItem('QUOKKA_REMEMBER') ) :
    ({ correo: null, secretPhrase: null });
  }

  public handlePersistRemember(correo: string, secretPhrase: string): void{
    console.log(correo, secretPhrase);
    localStorage.setItem('QUOKKA_REMEMBER', JSON.stringify({ correo, secretPhrase }));
  }

  public handleRemoveRemember(): void{
    localStorage.removeItem('QUOKKA_REMEMBER');
  }

  public logout(): void{
    localStorage.removeItem('QUOKKA_AUTH');
    this.userAuth = null;
  }
}
