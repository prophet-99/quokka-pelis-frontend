import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/facade.service';
import { ActorRequest } from '../../../models/request/actor.request';

declare const $: any;

@Component({
  selector: 'app-actor-conf',
  templateUrl: './actor-conf.component.html',
  styleUrls: ['./actor-conf.component.scss']
})
export class ActorConfComponent implements OnInit {

  public actores$: Observable<Actor[]> = null;
  public formActor: FormGroup = null;

  constructor(
    private actorService: ActorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chargeActores();
    this.formActor = this.formBuilder.group({
      id: [ 0 ],
      nombres: [ '', [ Validators.required ] ],
      apellidos: [ '', [ Validators.required ] ],
      nacionalidad: [ '', [ Validators.required ] ],
      genero: [ 'M', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargeActores(): void{
    this.actores$ = this.actorService.findAll();
  }

  private handleInitSearch(): void{
    this.formActor.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.actores$ = this.actorService.findByWord(search)
      );
  }

  public handleCreateActor(): void{
    this.formActor.get('id').setValue(0);
    this.formActor.get('nombres').setValue('');
    this.formActor.get('apellidos').setValue('');
    this.formActor.get('nacionalidad').setValue('');
    this.formActor.get('genero').setValue('M');
    this.formActor.updateValueAndValidity();
  }

  public handleEditActor(actor: Actor): void{
    this.formActor.get('id').setValue(actor.id);
    this.formActor.get('nombres').setValue(actor.nombres);
    this.formActor.get('apellidos').setValue(actor.apellidos);
    this.formActor.get('nacionalidad').setValue(actor.nacionalidad);
    const genero = actor.genero.slice(0, 1).toUpperCase();
    this.formActor.get('genero').setValue(genero);
    this.formActor.updateValueAndValidity();
  }

  public saveActor(): void{
    if (this.formActor.invalid) return;
    const { id, nombres, apellidos, nacionalidad , genero } = this.formActor.value;
    const actorRequest: ActorRequest = {
      id, nombres, apellidos, nacionalidad,
      genero: (genero === 'M') ? 'Masculino' : 'Femenino'
    };
    this.actorService.save(actorRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeActores.bind(this) ),
      tap( (_) => $('#modal-actor').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteActor(id: number): void{
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
        this.actorService.deleteActor(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeActores.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formActor.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al insertar rol', msg, 'error' );
    return of({ ok: false, msg: '' });
  }

}
