import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { RolService, UsuarioService } from 'src/app/services/facade.service';
import { Rol } from 'src/app/models/rol.model';
import { UsuarioRequest } from '../../../models/request/usuario.request';

declare const $: any;

@Component({
  selector: 'app-usuario-conf',
  templateUrl: './usuario-conf.component.html',
  styleUrls: ['./usuario-conf.component.scss']
})
export class UsuarioConfComponent implements OnInit {

  public usuarios$: Observable<Usuario[]> = null;
  public roles$: Observable<Rol[]> = null;
  public formUsuario: FormGroup = null;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.roles$ = this.rolService.findAll();
    this.chargeUsuarios();
    this.formUsuario = this.formBuilder.group({
      id: [ 0 ],
      correo: [ '', [ Validators.required, Validators.email ] ],
      contrasenia: [ '', [ Validators.required ] ],
      contraseniaPhrase: [ '', [ Validators.required ] ],
      nombres: [ '', [ Validators.required ] ],
      apellidos: [ '', [ Validators.required ] ],
      telefono: [ '', [ Validators.required ] ],
      idRol: [ '', [ Validators.required ] ],
      genero: [ 'M', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargeUsuarios(): void{
    this.usuarios$ = this.usuarioService.findAll();
  }

  private handleInitSearch(): void{
    this.formUsuario.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.usuarios$ = this.usuarioService.findByNameOrSurname(search)
      );
  }

  public handleCreateUsuario(): void{
    this.formUsuario.get('id').setValue(0);
    this.formUsuario.get('correo').setValue('');
    this.formUsuario.get('contrasenia').setValue('');
    this.formUsuario.get('contraseniaPhrase').setValue('');
    this.formUsuario.get('nombres').setValue('');
    this.formUsuario.get('apellidos').setValue('');
    this.formUsuario.get('telefono').setValue('');
    this.formUsuario.get('idRol').setValue('');
    this.formUsuario.get('genero').setValue('M');
    this.formUsuario.updateValueAndValidity();
  }

  public handleEditUsuario(usuario: Usuario): void{
    this.formUsuario.get('id').setValue(usuario.id);
    this.formUsuario.get('correo').setValue(usuario.correo);
    this.formUsuario.get('contrasenia').setValue('');
    this.formUsuario.get('contraseniaPhrase').setValue('');
    this.formUsuario.get('nombres').setValue(usuario.nombres);
    this.formUsuario.get('apellidos').setValue(usuario.apellidos);
    this.formUsuario.get('telefono').setValue(usuario.telefono);
    this.formUsuario.get('idRol').setValue(usuario.id_rol);
    const genero = usuario.genero.slice(0, 1).toUpperCase();
    this.formUsuario.get('genero').setValue(genero);
    this.formUsuario.updateValueAndValidity();
  }

  public saveUsuario(): void{
    if (this.formUsuario.invalid) return;
    const { id, correo, contrasenia, contraseniaPhrase,
      nombres, apellidos, telefono, idRol, genero } = this.formUsuario.value;
    const usuarioRequest: UsuarioRequest = {
      id, correo, contrasenia, contraseniaPhrase,
      nombres, apellidos, telefono, idRol,
      genero: (genero === 'M') ? 'Masculino' : 'Femenino'
    };
    this.usuarioService.save(usuarioRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeUsuarios.bind(this) ),
      tap( (_) => $('#modal-usuario').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteUsuario(id: number): void{
    Swal.fire({
      title: '¿Está seguro que desea eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed)
        this.usuarioService.deleteById(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeUsuarios.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formUsuario.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al insertar rol', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
