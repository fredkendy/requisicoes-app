//classe responsável pelas regras de autenticação

//Injectable permite ao angular realizar a injeção de dependência, controlando a instância assim que o componente invocar suas funções
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  //especifica o nível de injeção (raiz da aplicação)
  providedIn: 'root'
})
export class AuthenticationService {

  private user: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  authUser(): Observable<firebase.User | null> {
    return this.user;
  }

  //passamos 2 argumentos para a classe que injetamos no construtor
  login(email: string, senha: string): Promise<firebase.auth.UserCredential> {
    //recebe os 2 argumentos e retorna uma Promise (representa conclusao de operações asinc no JS) com as credenciais do usuario
    return this.afAuth.signInWithEmailAndPassword(email, senha);
  }

  //não passamos argumentos, invocamos a função signOut do AngularFireAuth para desconectar
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  //parametro email, assim o firebase envia um email com link para redefinicao de senha para o email informado
  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
  }
}
