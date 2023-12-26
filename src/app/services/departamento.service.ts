import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/iservicefirebase.service';
import { Departamento } from '../models/departamento.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService extends ServiceFirebase<Departamento> {

  constructor(firestore: AngularFirestore) {
    //recebe a classe, objeto firestore injetada no construtor e o nome que daremos para a coleção
    super(Departamento, firestore, 'departamentos');
  }
}
