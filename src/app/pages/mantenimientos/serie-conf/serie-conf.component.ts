import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Serie } from 'src/app/models/serie.model';
import { SeriesService, EstudioService, DirectorService, GeneroService} from 'src/app/services/facade.service';
import { Estudio } from 'src/app/models/estudio.model';
import { Director } from 'src/app/models/director.model';
import { Genero } from 'src/app/models/genero.model';
import { SerieRequest } from '../../../models/request/serie.request';

declare const $: any;

@Component({
  selector: 'app-serie-conf',
  templateUrl: './serie-conf.component.html',
  styleUrls: ['./serie-conf.component.scss']
})
export class SerieConfComponent implements OnInit {

  public series$: Observable<Serie[]> = null;
  public estudios$: Observable<Estudio[]> = null;
  public directores$: Observable<Director[]> = null;
  public generos$: Observable<Genero[]> = null;
  public formSerie: FormGroup = null;
  public archivo;

  constructor(
    private serieService: SeriesService,
    private estudioService: EstudioService,
    private generoService: GeneroService,
    private directorService: DirectorService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.estudios$ = this.estudioService.findAll();
    this.directores$ = this.directorService.findAll();
    this.generos$ = this.generoService.findAll();
    this.chargeSeries();
    this.formSerie = this.formBuilder.group({
      id: [ 0 ],
      nombre: [ '', [ Validators.required ] ],
      sinopsis: [ '', [ Validators.required ] ],
      anio_lanzamiento: [ '', [ Validators.required ] ],
      image: [ '', [ Validators.required ] ],
      directores: [ '', [ Validators.required ] ],
      generos: [ '', [ Validators.required ] ],
      id_estudio: [ '', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargeSeries(): void{
    this.series$ = this.serieService.findAll();
  }

  private handleInitSearch(): void{
    this.formSerie.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.series$ = this.serieService.findByName(search)
      );
  }

  public handleCreateSerie(): void{
    this.formSerie.get('id').setValue(0);
    this.formSerie.get('nombre').setValue('');
    this.formSerie.get('sinopsis').setValue('');
    this.formSerie.get('anio_lanzamiento').setValue('');
    this.formSerie.get('image').setValue('');
    this.formSerie.get('directores').setValue('');
    this.formSerie.get('generos').setValue('');
    this.formSerie.get('id_estudio').setValue('');
    this.formSerie.updateValueAndValidity();
  }

  public handleEditSerie(serie: Serie): void{
    this.formSerie.get('id').setValue(serie.id);
    this.formSerie.get('nombre').setValue(serie.SERIE);
    this.formSerie.get('sinopsis').setValue(serie.sinopsis);
    this.formSerie.get('anio_lanzamiento').setValue(serie.anio_lanzamiento);
    this.formSerie.get('id_estudio').setValue(serie.id_estudio);
    this.formSerie.updateValueAndValidity();
  }

  public CargarImagen(event): void{
    this.archivo = event.target.files[0];
  };

  public saveSerie(): void{
    if (this.formSerie.invalid) return;
    const { id, nombre, sinopsis, anio_lanzamiento, id_estudio, directores, generos } = this.formSerie.value;
    var cadenaDirectores = '', cadenaGeneros = '';
    directores.forEach((element, indice) => {
      if(indice == directores.length){
        cadenaDirectores = cadenaDirectores + element;
      }else{
        cadenaDirectores = cadenaDirectores + element + '-';
      }
    });
    console.log(directores.length);
    generos.forEach((element, indice) => {
      if(indice === generos.length){
        cadenaGeneros = cadenaGeneros + element;
      }else{
        cadenaGeneros = cadenaGeneros + element + '-';
      }
    });
    console.log(cadenaDirectores);
    console.log(cadenaGeneros);
    var formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('sinopsis', sinopsis);
    formData.append('anio_lanzamiento', anio_lanzamiento);
    formData.append('image', this.archivo);
    formData.append('id_estudio',id_estudio);
    formData.append('cadenaDirectores',cadenaDirectores);
    formData.append('cadenaGeneros',cadenaGeneros);
    const serieRequest: FormData = formData ;
    this.serieService.save(serieRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeSeries.bind(this) ),
      tap( (_) => $('#modal-serie').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deleteSerie(id: number): void{
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
        this.serieService.deleteSerie(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargeSeries.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formSerie.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }

}
