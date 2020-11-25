import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Estudio } from '../../../../app/models/estudio.model';
import { EstudioService } from '../../../services/facade.service';
import { EstudioRequest } from '../../../models/request/estudio.request';

declare const $: any;

@Component({
  selector: 'app-estudio-conf',
  templateUrl: './estudio-conf.component.html',
  styleUrls: ['./estudio-conf.component.scss']
})
export class EstudioConfComponent implements OnInit {

  public estudios$: Observable<Estudio[]> = null;
  public formEstudio: FormGroup = null;

  constructor(
    private estudioService: EstudioService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chargeEstudios();
    this.formEstudio = this.formBuilder.group({
      id: [ 0 ],
      nombre: [ '', [ Validators.required ] ],
      sede_principal: [ '', [ Validators.required ] ],
      search: [ '' ]
    });
    //this.handleInitSearch();
  }

  private chargeEstudios(): void{
    this.estudios$ = this.estudioService.findAll();
  }

  public handleCreateEstudio(): void{
    this.formEstudio.get('id').setValue(0);
    this.formEstudio.get('nombre').setValue('');
    this.formEstudio.get('sede_principal').setValue('');
    this.formEstudio.updateValueAndValidity();
  }

  public handleEditEstudio(estudio: Estudio): void{
    this.formEstudio.get('id').setValue(estudio.id);
    this.formEstudio.get('nombre').setValue(estudio.nombre);
    this.formEstudio.get('sede_principal').setValue(estudio.sede_principal);
    this.formEstudio.updateValueAndValidity();
  }

  public saveEstudio(): void{
    if (this.formEstudio.invalid) return;
    const { id, nombre, sede_principal } = this.formEstudio.value;
    const estudioRequest: EstudioRequest = {
      id, nombre, sede_principal
    };
    this.estudioService.save(estudioRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeEstudios.bind(this) ),
      tap( (_) => $('#modal-estudio').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteEstudio(id: number): void{
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
        this.estudioService.deleteEstudio(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeEstudios.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formEstudio.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }

}
