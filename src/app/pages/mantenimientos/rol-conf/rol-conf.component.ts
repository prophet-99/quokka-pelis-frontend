import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Rol } from 'src/app/models/rol.model';
import { RolService } from 'src/app/services/facade.service';

declare const $: any;
@Component({
  selector: 'app-rol-conf',
  templateUrl: './rol-conf.component.html',
  styleUrls: ['./rol-conf.component.scss']
})
export class RolConfComponent implements OnInit {

  public roles$: Observable<Rol[]> = null;
  public formRol: FormGroup = null;

  constructor(
    private rolService: RolService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chargeRoles();
    this.formRol = this.formBuilder.group({
      id: [ 0 ],
      descripcion: [ '', [ Validators.required ] ]
    });
  }

  private chargeRoles(): void{
    this.roles$ = this.rolService.findAll();
  }

  public handleCreateRol(): void{
    this.formRol.get('id').setValue(0);
    this.formRol.get('descripcion').setValue('');
    this.formRol.updateValueAndValidity();
  }

  public handleEditRol(rol: Rol): void{
    this.formRol.get('id').setValue(rol.id);
    this.formRol.get('descripcion').setValue(rol.descripcion);
    this.formRol.updateValueAndValidity();
  }

  public saveRol(): void{
    if (this.formRol.invalid) return;
    const { id, descripcion } = this.formRol.value;
    this.rolService.save(id, descripcion)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeRoles.bind(this) ),
      tap( (_) => $('#modal-rol').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteRol(id: number): void{
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
        this.rolService.deleteById(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeRoles.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formRol.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al insertar rol', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
