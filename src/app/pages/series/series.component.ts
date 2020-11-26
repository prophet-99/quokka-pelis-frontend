import { SeriesService } from '../../services/series.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Serie } from 'src/app/models/serie.model';
import { Genero } from 'src/app/models/genero.model';
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  public series: ISerie[] = [];
  public formSerie: FormGroup = null;

  constructor(
    private seriesService: SeriesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.seriesService.findAll()
      .pipe(
        mergeMap( (serie) => from(serie) ),
        mergeMap( (serie) =>
          this.seriesService.findGeneros(serie.id)
            .pipe( map(gns => ({ ...serie, generos: gns })) )
        )
      ).subscribe( (nSerie) => this.series.push(nSerie) );

    this.formSerie = this.formBuilder.group({
      search: [ '' ]
    });

    this.formSerie.get('search').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        tap( (_) => this.series = [] ),
        mergeMap( (query) => this.seriesService.findByName(query) ),
        mergeMap( (serie) => from(serie) ),
        mergeMap( (serie) =>
          this.seriesService.findGeneros(serie.id)
            .pipe( map(gns => ({ ...serie, generos: gns })) )
        ),
      ).subscribe( (nSerie) => this.series.push(nSerie) );
  }
}

interface ISerie extends Serie {
  generos: Genero[];
}
