import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { SerieMant } from 'src/app/models/serieMant.model';
import { SeriesService, EstudioService, DirectorService, GeneroService, TemporadaService} from 'src/app/services/facade.service';
import { Estudio } from 'src/app/models/estudio.model';
import { Director } from 'src/app/models/director.model';
import { Genero } from 'src/app/models/genero.model';
import { Season } from 'src/app/models/season.model';
import { SerieRequest } from '../../../models/request/serie.request';

declare const $: any;

@Component({
  selector: 'app-serie-conf',
  templateUrl: './serie-conf.component.html',
  styleUrls: ['./serie-conf.component.scss']
})
export class SerieConfComponent implements OnInit {

  public series$: Observable<SerieMant[]> = null;
  public estudios$: Observable<Estudio[]> = null;
  public directores$: Observable<Director[]> = null;
  public generos$: Observable<Genero[]> = null;
  public temporadas$: Observable<Season[]> = null;
  public formSerie: FormGroup = null;
  public formTemporada: FormGroup = null;
  public formCapitulo: FormGroup = null;
  public archivo;

  constructor(
    private serieService: SeriesService,
    private temporadaService: TemporadaService,
    private estudioService: EstudioService,
    private generoService: GeneroService,
    private directorService: DirectorService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.estudios$ = this.estudioService.findAll();
    this.directores$ = this.directorService.findAll();
    this.generos$ = this.generoService.findAll();
    this.temporadas$ = this.temporadaService.findAll();
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
    this.formTemporada = this.formBuilder.group({
      idTemp: [ 0 ],
      numeroTemp: [ '', [ Validators.required ] ],
      descripcionTemp: [ '', [ Validators.required ] ],
      id_sTemp: [ '', [ Validators.required ] ]
    });
    this.formCapitulo = this.formBuilder.group({
      idCap: [ 0 ],
      numeroCap: [ '', [ Validators.required ] ],
      sinopsisCap: [ '', [ Validators.required ] ],
      id_tempCap: [ '', [ Validators.required ] ],
      url_videoCap: [ '', [ Validators.required ] ],
      valoracionCap: [ '', [ Validators.required ] ],
      duracionCap: [ '', [ Validators.required ] ]
    });
    this.handleInitSearch();
  }

  private chargeSeries(): void{
    this.series$ = this.serieService.findAllMant();
  }

  private handleInitSearch(): void{
    this.formSerie.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.series$ = this.serieService.findAllMant()
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

  public handleCreateTemp(): void{
    this.formTemporada.get('idTemp').setValue(0);
    this.formTemporada.get('numeroTemp').setValue('');
    this.formTemporada.get('descripcionTemp').setValue('');
    this.formTemporada.get('id_sTemp').setValue('');
    this.formTemporada.updateValueAndValidity();
  }

  public handleCreateCap(): void{
    this.formCapitulo.get('idCap').setValue(0);
    this.formCapitulo.get('numeroCap').setValue('');
    this.formCapitulo.get('sinopsisCap').setValue('');
    this.formCapitulo.get('url_videoCap').setValue('');
    this.formCapitulo.get('valoracionCap').setValue('');
    this.formCapitulo.get('duracionCap').setValue('');
    this.formCapitulo.updateValueAndValidity();
  }

  public handleEditSerie(serie: SerieMant): void{
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

  public saveTemp(): void{
    if (this.formTemporada.invalid) return;
    const { idTemp, numeroTemp,  descripcionTemp, id_sTemp} = this.formTemporada.value;
    var formData = new FormData();
    formData.append('id', idTemp);
    formData.append('numero', numeroTemp);
    formData.append('descripcion', descripcionTemp);
    formData.append('id_serie', id_sTemp);
    const temporadaRequest: FormData = formData ;
    this.temporadaService.save(temporadaRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargeSeries.bind(this) ),
      tap( (_) => $('#modal-temporada').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public saveCap(): void{
  }

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

  public hasErrorRequiredTemp(controlName: string): boolean{
    const controlTemp = this.formTemporada.get(controlName);
    return (controlTemp.hasError('required') && controlTemp.touched) ?
    true : false;
  }

  public hasErrorRequiredCap(controlName: string): boolean{
    const controlCap = this.formCapitulo.get(controlName);
    return (controlCap.hasError('required') && controlCap.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al procesar la solicitud', msg, 'error' );
    return of({ ok: false, msg: '' });
  }

}
