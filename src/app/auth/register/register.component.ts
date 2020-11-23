import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { UsuarioRequest } from 'src/app/models/request/usuario.request';
import { AuthService, UsuarioService } from 'src/app/services/facade.service';
import { AuthRequest } from 'src/app/models/request/auth.request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public formRegister: FormGroup = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formRegister = this.formBuilder.group({
      correo: [ '', [ Validators.required, Validators.email ] ],
      contrasenia: [ '', [ Validators.required ] ],
      contraseniaPhrase: [ '', [ Validators.required ] ],
      nombres: [ '', [ Validators.required ] ],
      apellidos: [ '', [ Validators.required ] ],
      telefono: [ '', [ Validators.required ] ],
      idRol: [ 0, [ Validators.required ] ],
      genero: [ 'M', [ Validators.required ] ]
    });
  }

  public submitRegister(): void{
    if (this.formRegister.invalid) return;
    const { correo, contrasenia, contraseniaPhrase,
    nombres, apellidos, telefono, idRol, genero } =  this.formRegister.value;

    const usuarioRequest: UsuarioRequest = {
      id: 0, correo, contrasenia, contraseniaPhrase, nombres,
      apellidos, telefono, idRol, genero: (genero === 'M') ? 'Masculino' : 'Femenino'
    };
    const authRequest: AuthRequest = {
      email: correo, password: contrasenia,
      phrase: contraseniaPhrase
    };
    this.usuarioService.save(usuarioRequest)
      .pipe(
        catchError( this.handleError ),
        filter( ({ ok }) => (ok) ),
        mergeMap( (_) => this.authService.loginUser(authRequest) )
      ).subscribe( (_) => this.router.navigateByUrl('/dashboard') );
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formRegister.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  public get hasErrorEmail(): boolean{
    const control = this.formRegister.get('correo');
    return (control.hasError('email') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    if (codeError === 2627){
      Swal.fire(
        'Error en el registro',
        'El correo ya se encuentra tomado',
        'error'
      );
      return of({ ok: false, msg: '' });
    }
    Swal.fire( 'Error en el registro', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
