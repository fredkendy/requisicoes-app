import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Departamento } from '../../../models/departamento.model';
import { Funcionario } from '../../../models/funcionario.model';
import { DepartamentoService } from '../../../services/departamento.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import Swal from 'sweetalert2';

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

  //injeta os dois serviços e a classe que utilizamos para o formulario
  constructor(
    //private storage: AngularFireStorage,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder) { }

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

}
