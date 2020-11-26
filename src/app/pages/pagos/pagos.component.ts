import { PagoService } from '../../services/pago.service';
import { Component, OnInit } from '@angular/core';
import { PagoRequest } from 'src/app/models/request/pago.request';
import { AuthService } from '../../services/facade.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReportePagos } from '../../models/reporte-pagos.model';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  public currentUser: User = null;
  public pagos$: Observable<ReportePagos[]> = null;

  constructor(
    private pagoService: PagoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.userAuth;
    this.pagos$ = this.pagoService.getBoletaByUsuario(this.currentUser.id);
  }

  public handlePago(tipo: 'mensual' | 'anual' ): void{
    const pagoReq: PagoRequest = {
      descripcion:  `Pago por suscripción ${ tipo }`,
      estado: 1, fecha_inicio: new Date().toString(),
      idSuscr: 0, idUsu: this.currentUser.id,
      monto: (tipo === 'mensual') ? 45 : 500,
      tipo
    };

    this.pagoService.persistPago(pagoReq)
      .pipe(
        tap( (_) => this.handleUpdateUsuario(tipo) ),
      ).subscribe( (_) => Swal.fire('Operación exitosa', '', 'success') );
  }

  private handleUpdateUsuario(tipo: string): void{
    const userAuth = new User(
      this.currentUser.id, this.currentUser.correo, this.currentUser.nombres,
      this.currentUser.apellidos, this.currentUser.telefono,
      (tipo === 'mensual') ? 3 : 2,
      this.currentUser.genero
    );
    localStorage.setItem('QUOKKA_AUTH', JSON.stringify(userAuth));
    this.authService.handleListenerAuth();
    this.currentUser.id_rol = userAuth.id_rol;
  }
}
