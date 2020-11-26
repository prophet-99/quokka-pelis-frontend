import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Genero } from 'src/app/models/genero.model';
import { GeneroService } from 'src/app/services/facade.service';
import { GeneroRequest } from '../../../models/request/genero.request';

declare const $: any;

@Component({
  selector: 'app-genero-conf',
  templateUrl: './genero-conf.component.html',
  styleUrls: ['./genero-conf.component.scss']
})
export class GeneroConfComponent implements OnInit {

  public generos$: Observable<Genero[]> = null;
  public formGenero: FormGroup = null;

  constructor(
    private generoService: GeneroService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chargeGeneros();
    this.formGenero = this.formBuilder.group({
      id: [ 0 ],
      descripcion: [ '', [ Validators.required ] ]
    });
    this.handleInitSearch();
  }

  private chargeGeneros(): void{
    this.generos$ = this.generoService.findAll();
  }

  private handleInitSearch(): void{
    this.formGenero.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.generos$ = this.generoService.findByWord(search)
      );
  }

  public handleCreateGenero(): void{
    this.formGenero.get('id').setValue(0);
    this.formGenero.get('descripcion').setValue('');
    this.formGenero.updateValueAndValidity();
  }

  public handleEditGenero(genero: Genero): void{
    this.formGenero.get('id').setValue(genero.id);
    this.formGenero.get('descripcion').setValue(genero.descripcion);
    this.formGenero.updateValueAndValidity();
  }

  public saveGenero(): void{
    if (this.formGenero.invalid) return;
    const { id, descripcion } = this.formGenero.value;
    const generoRequest: GeneroRequest = {
      id, descripcion };
    this.generoService.save(generoRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeGeneros.bind(this) ),
      tap( (_) => $('#modal-genero').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteGenero(id: number): void{
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
        this.generoService.deleteGender(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeGeneros.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formGenero.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }

}
