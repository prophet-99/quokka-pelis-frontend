import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Director } from '../../../models/director.model';
import { DirectorService } from '../../../services/facade.service';
import { DirectorRequest } from '../../../models/request/director.request';

declare const $: any;
@Component({
  selector: 'app-director-conf',
  templateUrl: './director-conf.component.html',
  styleUrls: ['./director-conf.component.scss']
})
export class DirectorConfComponent implements OnInit {

  public directores$: Observable<Director[]> = null;
  public formDirector: FormGroup = null;

  constructor(
    private directorService: DirectorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chargeDirectores();
    this.formDirector = this.formBuilder.group({
      id: [ 0 ],
      nombres: [ '', [ Validators.required ] ],
      apellidos: [ '', [ Validators.required ]],
      nacionalidad: [ '', [ Validators.required ]],
      genero: [ 'M', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargeDirectores(): void{
    this.directores$ = this.directorService.findAll();
  }

  private handleInitSearch(): void{
    this.formDirector.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.directores$ = this.directorService.findByWord(search)
      );
  }

  public handleCreateDirector(): void{
    this.formDirector.get('id').setValue(0);
    this.formDirector.get('nombres').setValue('');
    this.formDirector.get('apellidos').setValue('');
    this.formDirector.get('nacionalidad').setValue('');
    this.formDirector.get('genero').setValue('M');
    this.formDirector.updateValueAndValidity();
  }

  public handleEditDirector(director: Director): void{
    this.formDirector.get('id').setValue(director.id);
    this.formDirector.get('nombres').setValue(director.nombres);
    this.formDirector.get('apellidos').setValue(director.apellidos);
    this.formDirector.get('nacionalidad').setValue(director.nacionalidad);
    const genero = director.genero.slice(0, 1).toUpperCase();
    this.formDirector.get('genero').setValue(genero);
    this.formDirector.updateValueAndValidity();
  }

  public saveDirector(): void{
    if (this.formDirector.invalid) return;
    const { id, nombres, apellidos, nacionalidad, genero } = this.formDirector.value;
    const directorRequest: DirectorRequest = {
      id, nombres, apellidos, nacionalidad, 
      genero: (genero === 'M') ? 'Masculino' : 'Femenino' };
    this.directorService.save(directorRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeDirectores.bind(this) ),
      tap( (_) => $('#modal-genero').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteDirector(id: number): void{
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
        this.directorService.deleteDirector(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeDirectores.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formDirector.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
