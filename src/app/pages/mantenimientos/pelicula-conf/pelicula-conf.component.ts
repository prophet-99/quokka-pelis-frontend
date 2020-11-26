import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Pelicula } from 'src/app/models/pelicula.model';
import { PeliculasService, EstudioService, DirectorService, GeneroService , VideoService} from 'src/app/services/facade.service';
import { Estudio } from 'src/app/models/estudio.model';
import { Director } from 'src/app/models/director.model';
import { Genero } from 'src/app/models/genero.model';
import { Video } from 'src/app/models/video.model';
import { PeliculaRequest } from '../../../models/request/pelicula.request';
import { VideoRequest } from '../../../models/request/video.request';

declare const $: any;

@Component({
  selector: 'app-pelicula-conf',
  templateUrl: './pelicula-conf.component.html',
  styleUrls: ['./pelicula-conf.component.scss']
})
export class PeliculaConfComponent implements OnInit {

  public peliculas$: Observable<Pelicula[]> = null;
  public estudios$: Observable<Estudio[]> = null;
  public directores$: Observable<Director[]> = null;
  public generos$: Observable<Genero[]> = null;
  public videos$: Observable<Video[]> = null;
  public formPelicula: FormGroup = null;
  public archivo;

  constructor(
    private peliculaService: PeliculasService,
    private estudioService: EstudioService,
    private generoService: GeneroService,
    private directorService: DirectorService,
    private videoService: VideoService,
    private formBuilder: FormBuilder,
    
  ) { }

  ngOnInit(): void {
    this.estudios$ = this.estudioService.findAll();
    this.directores$ = this.directorService.findAll();
    this.generos$ = this.generoService.findAll();
    this.videos$ = this.videoService.findAll();
    this.chargePeliculas();
    this.formPelicula = this.formBuilder.group({
      id: [ 0 ],
      nombre: [ '', [ Validators.required ] ],
      sinopsis: [ '', [ Validators.required ] ],
      anio_lanzamiento: [ '', [ Validators.required ] ],
      image: [ '', [ Validators.required ] ],
      url_video: [ '', [ Validators.required ] ],
      valoracion: [ '', [ Validators.required ] ],
      duracion: [ '', [ Validators.required ] ],
      directores: [ '', [ Validators.required ] ],
      generos: [ '', [ Validators.required ] ],
      id_estudio: [ '', [ Validators.required ] ],
      search: [ '' ]
    });
    this.handleInitSearch();
  }

  private chargePeliculas(): void{
    this.peliculas$ = this.peliculaService.findAll();
  }

  private handleInitSearch(): void{
    this.formPelicula.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(
        ({ search }) => this.peliculas$ = this.peliculaService.findByWord(search)
      );
  }

  public handleCreatePelicula(): void{
    this.formPelicula.get('id').setValue(0);
    this.formPelicula.get('nombre').setValue('');
    this.formPelicula.get('sinopsis').setValue('');
    this.formPelicula.get('anio_lanzamiento').setValue('');
    this.formPelicula.get('image').setValue('');
    this.formPelicula.get('valoracion').setValue('');
    this.formPelicula.get('duracion').setValue('');
    this.formPelicula.get('directores').setValue('');
    this.formPelicula.get('generos').setValue('');
    this.formPelicula.get('url_video').setValue('');
    this.formPelicula.get('id_estudio').setValue('');
    this.formPelicula.updateValueAndValidity();
  }

  public handleVerSinopsis(sinopsis: string): void{
    this.formPelicula.get('sinopsis').setValue(sinopsis);
  }

  public handleEditPelicula(pelicula: Pelicula): void{
    this.formPelicula.get('id').setValue(pelicula.id);
    this.formPelicula.get('nombre').setValue(pelicula.nombre);
    this.formPelicula.get('sinopsis').setValue(pelicula.sinopsis);
    this.formPelicula.get('anio_lanzamiento').setValue(pelicula.anio_lanzamiento);
    this.formPelicula.get('url_video').setValue(pelicula.url_video);
    this.formPelicula.get('valoracion').setValue(pelicula.valoracion);
    this.formPelicula.get('duracion').setValue(pelicula.duracion);
    this.formPelicula.get('id_estudio').setValue(pelicula.id_estudio);
    this.formPelicula.updateValueAndValidity();
  }

  public CargarImagen(event): void{
    this.archivo = event.target.files[0];
  };

  public savePelicula(): void{
    if (this.formPelicula.invalid) return;
    const { id, nombre, sinopsis, anio_lanzamiento, valoracion, duracion, url_video ,id_estudio, directores, generos } = this.formPelicula.value;
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
    formData.append('url_video',url_video);
    formData.append('valoracion',valoracion);
    formData.append('duracion',duracion);
    const peliculaRequest: FormData = formData ;
    this.peliculaService.save(peliculaRequest)
    .pipe(
      catchError( this.handleError ),
      filter( ({ ok }) => (ok) ),
      tap( this.chargePeliculas.bind(this) ),
      tap( (_) => $('#modal-pelicula').modal('hide') )
    ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success'));
  }

  public deletePelicula(id: number): void{
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
        this.peliculaService.deletePelicula(id)
        .pipe(
          catchError( this.handleError ),
          filter( ({ ok }) => (ok) ),
          tap( this.chargePeliculas.bind(this) )
        ).subscribe();
    });
  }

  public hasErrorRequired(controlName: string): boolean{
    const control = this.formPelicula.get(controlName);
    return (control.hasError('required') && control.touched) ?
    true : false;
  }

  private handleError({ codeError, msg }): Observable<{ ok: boolean, msg: string }>{
    Swal.fire( 'Error al insertar rol', msg, 'error' );
    return of({ ok: false, msg: '' });
  }
}
