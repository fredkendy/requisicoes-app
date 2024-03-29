import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/servicefirebase.service';
import { Funcionario } from '../models/funcionario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService extends ServiceFirebase<Funcionario> {

  constructor(firestore: AngularFirestore) {
    //recebe a classe, objeto firestore injetada no construtor e o nome que daremos para a coleção
    super(Funcionario, firestore, 'funcionarios');
  }

  //recuperar dados do funcionario com base no usuario logado
  //passamos o email e atraves da ref, cria uma consulta na coleção de funcionarios em where 'email' == email
  getFuncionarioLogado(email: string) {
    //console.log(email)
    return this.firestore.collection<Funcionario>('funcionarios', ref =>
      ref.where('email', '==', email)
    ).valueChanges()
  }
}
