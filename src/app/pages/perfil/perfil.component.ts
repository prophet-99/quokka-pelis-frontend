import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public userAuth: User = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userAuth =  this.authService.userAuth;
  }

}
