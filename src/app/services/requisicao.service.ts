import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Requisicao } from '../models/requisicao.model';
import { ServiceFirebase } from '../core/servicefirebase.service';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService extends ServiceFirebase<Requisicao> {

  constructor(firestore: AngularFirestore) {
    //recebe a classe, objeto firestore injetada no construtor e o nome que daremos para a coleção
    super(Requisicao, firestore, 'requisicoes')
  }
}
