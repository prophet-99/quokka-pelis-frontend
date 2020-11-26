import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Personaje } from '../../../models/personaje.model';
import { Pelicula } from '../../../models/pelicula.model';
import { Actor } from '../../../models/actor.model';
import { PersonajeService, PeliculasService, ActorService } from '../../../services/facade.service';
import { PersonajeRequest } from '../../../models/request/personaje.request';

declare const $: any;

@Component({
  selector: 'app-personaje-conf',
  templateUrl: './personaje-conf.component.html',
  styleUrls: ['./personaje-conf.component.scss']
})
export class PersonajeConfComponent implements OnInit {

  public personajes$: Observable<Personaje[]> = null;
  public peliculas$: Observable<Pelicula[]> = null;
  public actores$: Observable<Actor[]> = null;
  public formPersonaje: FormGroup = null;

  constructor(
    private personajeService: PersonajeService,
    private peliculaService: PeliculasService,
    private actorService: ActorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.peliculas$ = this.peliculaService.findAll();
    this.actores$ = this.actorService.findAll();
    this.chargePersonajes();
    this.formPersonaje = this.formBuilder.group({
      id: [ 0 ],
      idActor: [ '', [ Validators.required ] ],
      idPelicula: [ '', [ Validators.required ] ],
      nombre: [ '', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargePersonajes(): void{
    this.personajes$ = this.personajeService.findAll();
  }

  private handleInitSearch(): void{
    this.formPersonaje.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.personajes$ = this.personajeService.findByWord(search)
      );
  }

  public handleCreatePersonaje(): void{
    this.formPersonaje.get('id').setValue(0);
    this.formPersonaje.get('idActor').setValue('');
    this.formPersonaje.get('idPelicula').setValue('');
    this.formPersonaje.get('nombre').setValue('');
    this.formPersonaje.updateValueAndValidity();
  }

  public handleEditPersonaje(personaje: Personaje): void{
    this.formPersonaje.get('id').setValue(personaje.id);
    this.formPersonaje.get('idActor').setValue(personaje.idActor);
    this.formPersonaje.get('idPelicula').setValue(personaje.idPelicula);
    this.formPersonaje.get('nombre').setValue(personaje.personaje);
    this.formPersonaje.updateValueAndValidity();
  }

  public savePersonaje(): void{
    if (this.formPersonaje.invalid) return;
    const { id, idActor, idPelicula, nombre } = this.formPersonaje.value;
    const personajeRequest: PersonajeRequest = {
      id, idActor, idPelicula, nombre
    };
    this.personajeService.save(personajeRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargePersonajes.bind(this) ),
      tap( (_) => $('#modal-personaje').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deletePersonaje(id: number): void{
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
        this.personajeService.deletePersonaje(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargePersonajes.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formPersonaje.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
