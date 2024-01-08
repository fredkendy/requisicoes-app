import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Departamento } from '../../../models/departamento.model';
import { Funcionario } from '../../../models/funcionario.model';
import { DepartamentoService } from '../../../services/departamento.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import Swal from 'sweetalert2';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {
  
  //mesmos objetos do componente departamento (ex: departamentos$ e departamentoFiltro)
  funcionarios$!: Observable<Funcionario[]>;
  departamentos$!: Observable<Departamento[]>;
  //filtro na tabeela por departamento
  departamentoFiltro!: string;
  edit!: boolean;
  displayDialogFuncionario!: boolean;
  form!: FormGroup;

  //Para upload de fotos no storage firebase
  //ViewChild para acessar o componente. Static verifica os resultados da consulta antes da execução de detecção de alteração no componente
  @ViewChild('inputFile', { static: false }) inputFile!: ElementRef; //referencia ao template
  uploadPercent!: Observable<number | undefined>; 
  downloadURL!: Observable<string>; //captura o endereço do recurso no servidor
  task!: AngularFireUploadTask; //interface para tarefas no storage
  complete!: boolean;

  //injeta os dois serviços e a classe que utilizamos para o formulario
  constructor(
    //private storage: AngularFireStorage,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder,
    private storage: AngularFireStorage) { }

  //carregamos funcionarios e departamentos dos serviços de list() para exibir no template
  ngOnInit() {
    this.funcionarios$ = this.funcionarioService.list();
    this.departamentos$ = this.departamentoService.list();
    //definir valor de inicialização como 'TODOS'. Posteriormente com o filtro, isso indicará para exivir os funcionarios de todos os dptos
    this.departamentoFiltro = 'TODOS'
    this.configForm();
  }

  configForm() {
    //campos para o objeto que representa o formulario, instanciando respectivo controle e validações
    this.form = this.fb.group({
      id: new FormControl(),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),  //mais de uma validação
      funcao: new FormControl(''),
      departamento: new FormControl('', Validators.required),
      foto: new FormControl()
    })
  }

  //trechos abaixo tirados do departamento.component.ts (similar)
  add() {
    this.form.reset();
    this.edit = false;
    this.displayDialogFuncionario = true;
  }

  selecionaFuncionario(func: Funcionario) {
    this.edit = true;
    this.displayDialogFuncionario = true;
    this.form.setValue(func);
  }

  save() {
    this.funcionarioService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogFuncionario = false;
        Swal.fire(`Funcionário ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success')
        this.displayDialogFuncionario = false;
      })
      .catch((erro) => {
        this.displayDialogFuncionario = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Funcionário.`, `Detalhes: ${erro}`, 'error')
      })
    this.form.reset()
  }

  delete(depto: Funcionario) {
    Swal.fire({
      title: 'Confirma a exclusão do Funcionário?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.funcionarioService.delete(depto.id)
          .then(() => {
            Swal.fire('Funcionario excluído com sucesso!', '', 'success')
          })
      }
    })
  }

  //event vindo do template
  //@ts-ignore
  async upload(event) {
    this.complete = false;
    //recupera o arquivo com o objeto file
    const file = event.target.files[0];
    const path = `funcionarios/${new Date().getTime().toString()}`;
    const fileRef = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.task.then(up => {
      fileRef.getDownloadURL().subscribe(url => {
        this.complete = true;
        this.form.patchValue({
          foto: url
        })
      });
    });
    this.uploadPercent = this.task.percentageChanges();
    this.inputFile.nativeElement.value = '';
  }

}
