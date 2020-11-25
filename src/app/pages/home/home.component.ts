import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { GeneroWithCantidad } from 'src/app/models/genero-with-cantidad.model';
import { HomeService } from '../../services/facade.service';
import { Pelicula } from '../../models/pelicula.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public generos$: Observable<GeneroWithCantidad[]> = null;
  public peliculasTop3$: Observable<Pelicula[]> = null;
  public peliculas$: Observable<Pelicula[]> = null;

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.generos$ = this.homeService.findGenerosWithCantidad();
    this.peliculasTop3$ = this.homeService.findTop3PeliculasEstreno();
    this.peliculas$ = this.homeService.findPeliculasEstreno();
  }

}
