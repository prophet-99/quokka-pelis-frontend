import { SeriesService } from '../../../services/series.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Genero } from 'src/app/models/genero.model';
import { Director } from 'src/app/models/director.model';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Serie } from 'src/app/models/serie.model';
import { Season } from '../../../models/season.model';
import { Capitulo } from '../../../models/capitulo.model';

@Component({
  selector: 'app-serie-detalle',
  templateUrl: './serie-detalle.component.html',
  styleUrls: ['./serie-detalle.component.scss']
})
export class SerieDetalleComponent implements OnInit {

  public serie: Serie = {
    ESTUDIO: '', SERIE: '', anio_lanzamiento: '',
    id: 0, sinopsis: '', url_poster: ''
  };
  public generos$: Observable<Genero[]> = null;
  public directores$: Observable<Director[]> = null;
  public seasons$: Observable<Season[]> = null;
  public seasons: ISerieDetalle[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private serieService: SeriesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap( ({ id }) => this.serieService.findById(id) ),
        tap( ({ id }) => this.directores$ = this.serieService.findDirectors(id) ),
        tap( ({ id }) => this.generos$ = this.serieService.findGeneros(id) ),
        tap( ({ id }) => this.serieService.findGeneros(id) ),
        tap( (serie) => this.serie = serie ),
        tap(
          ({ id }) => this.serieService.findSeasons(id)
            .pipe(
                mergeMap( (series) => from(series) ),
                mergeMap( (serie) =>
                this.serieService.findCapitulosBySeason(serie.id)
                .pipe( map(cns => this.seasons.push({ ...serie, capitulos: cns }) )
                )
             )
          ).subscribe()
        )
      ).subscribe(
        (serie) => (!serie) ? this.router.navigateByUrl('/') : null
      );
  }

}

interface ISerieDetalle extends Season{
 capitulos: Capitulo[];
}
