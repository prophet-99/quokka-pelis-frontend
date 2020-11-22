import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Rol } from 'src/app/models/rol.model';
import { RolService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-rol-conf',
  templateUrl: './rol-conf.component.html',
  styleUrls: ['./rol-conf.component.scss']
})
export class RolConfComponent implements OnInit {

  public roles$: Observable<Rol[]> = null;

  constructor(
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.roles$ = this.rolService.findAll();
  }

}
