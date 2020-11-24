import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/facade.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('QUOKKA_AUTH')){
      this.router.navigateByUrl('/dashboard');
      return;
    }
    const { correo, secretPhrase } = this.authService.handleGetRemember();
    this.formLogin = this.formBuilder.group({
      email: [ correo, [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
      phrase: [ secretPhrase, [ Validators.required ] ],
      remember: [ (correo) ? true : false, [ Validators.required ] ]
    });
  }

  public submitLogin(): void{
    if (this.formLogin.invalid) return;
    const { email, password, phrase, remember } = this.formLogin.value;
    this.authService.loginUser({ email, password, phrase })
      .pipe( tap( ({ ok }) =>
        (ok && remember) ?
        this.authService.handlePersistRemember(email, phrase) :
        this.authService.handleRemoveRemember()
      )).subscribe( ({ ok }) =>
        (ok) ?
        this.router.navigateByUrl('/dashboard') :
        Swal.fire(
          'Error en la autenticación',
          'Usuario o contraseña incorrecta',
          'error')
      );
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formLogin.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  public get hasErrorEmail(): boolean{
    const control = this.formLogin.get('email');
    return (control.hasError('email') && control.touched) ?
    true : false;
  }
}
