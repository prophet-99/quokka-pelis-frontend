import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-usuario-conf',
  templateUrl: './usuario-conf.component.html',
  styleUrls: ['./usuario-conf.component.scss']
})
export class UsuarioConfComponent implements OnInit {

  public usuarios$: Observable<Usuario[]> = null;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarios$ = this.usuarioService.findAll();
  }

}
