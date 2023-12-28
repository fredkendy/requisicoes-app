import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
//interface que auxilia no gerenciamento da navegação, decidindo se uma rota pode ser ativada
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  //injetar 2 classes (observar estado da autenticacao e redirecionar a navegação)
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  //retorna false se nao existir um user, e redirecionando a navegação para a rota /login
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })

    )
  }
}
