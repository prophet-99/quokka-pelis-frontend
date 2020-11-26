import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SeriesService } from 'src/app/services/series.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Serie } from 'src/app/models/serie.model';
import { Director } from 'src/app/models/director.model';
import { Genero } from 'src/app/models/genero.model';
import { Season } from '../../../models/season.model';
import { Capitulo } from '../../../models/capitulo.model';

@Component({
  selector: 'app-serie-detalle-video',
  templateUrl: './serie-detalle-video.component.html',
  styleUrls: ['./serie-detalle-video.component.scss']
})
export class SerieDetalleVideoComponent implements OnInit {

  public serie: Serie = {
    ESTUDIO: '', SERIE: '', anio_lanzamiento: '',
    id: 0, sinopsis: '', url_poster: ''
  };
  public generos$: Observable<Genero[]> = null;
  public directores$: Observable<Director[]> = null;
  public seasons: ISerieDetalle[] = [];

  public currentSerieId = 0;
  public currentSeasonId = 0;
  public currentCapituloId = 0;
  public currentSeason: Season = null;
  public currentCapitulo: Capitulo = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private serieService: SeriesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        tap( ({ id, idT, idC }) => {
          this.currentSerieId = id;
          this.currentSeasonId = idT;
          this.currentCapituloId = idC;
        } ),
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
                .pipe(
                  map(cns => this.seasons.push({ ...serie, capitulos: cns }) ),
                )
             )
          ).subscribe(
            () => null,
            (err) => console.log(err),
            () => {
              console.log(this.currentSeasonId, this.currentCapituloId, this.seasons);
              this.currentSeason  = this.seasons.find( (s) => s.id == this.currentSeasonId );
              this.currentCapitulo = this.seasons.find( (s) => s.id == this.currentSeasonId )
                .capitulos.find( (c) => c.id == this.currentCapituloId );
            }
          )
        )
      ).subscribe(
        (serie) => (!serie) ? this.router.navigateByUrl('/') : null
      );
  }
}

interface ISerieDetalle extends Season{
  capitulos: Capitulo[];
}
