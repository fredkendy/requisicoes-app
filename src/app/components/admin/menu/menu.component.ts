import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  user!: Observable<firebase.User | null>; // Update the type to allow for null values

  constructor(private authServ: AuthenticationService, private router: Router) { }

  ngOnInit() {
    //funcao authUser() retorna um Observable do usuario no Firebase
    this.user = this.authServ.authUser();
  }

  sair() {
    this.authServ.logout().then(() => this.router.navigate(['/']));
  }
}
