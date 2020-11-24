import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GeneroService } from 'src/app/services/genero.service';
import { GeneroWithCantidad } from 'src/app/models/genero-with-cantidad.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public generos$: Observable<GeneroWithCantidad[]> = null;

  constructor(
    private generoService: GeneroService
  ) { }

  ngOnInit(): void {
    this.generos$ = this.generoService.findAllWithCantidad();
  }

}
