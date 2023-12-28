import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Departamento } from '../../../models/departamento.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../../services/departamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.css'
})
export class DepartamentoComponent {
  //obj do tipo Observable que apresentará registros salvos no Firebase
  departamentos$!: Observable<Departamento[]>;  //$: convenção para objetos que usam operações assincronas
  edit!: boolean;                               //controla o modo de inclusao/edicao para apresentar a legenda correta no botão
  displayDialogDepartamento!: boolean;          //representa visibilidade de um componente dialog do template
  form!: FormGroup;                             //representa a instancia de componentes do formulario

  //injeção do serviço de departamentoService e classe formbuilder, que cria formulários complexos sem necessidade de vários controles
  constructor(private departamentoService: DepartamentoService, private fb: FormBuilder) {}

  ngOnInit() {
    //preenche campo departamentos$ invocando o método list() do serviço logo na inicialização
    this.departamentos$ = this.departamentoService.list()
    this.configForm()
  }

  //definir campos do formulario e configurar regras de validacao
  configForm() {
    this.form = this.fb.group({   //group: cria instancia do formulario, passando uma coleção FormControl para cada atributo
      id: new FormControl(),
      nome: new FormControl('', Validators.required), //campo obrigatorio
      telefone: new FormControl('')
    })
  }
  //aciona o dialog para incluirmos um departamento
  add() {
    this.form.reset();  //reinicia o estado do form de todos os campos para nulo
    this.edit = false;  //indica que nao estamos em edição
    this.displayDialogDepartamento = true;  //exibe o componente que possuirá essa propriedade
  }

  //seleção do objeto na tabela. Parametro: objeto selecionado a partir do template
  selecionaDepartamento(depto: Departamento) {
    this.edit = true;
    this.displayDialogDepartamento = true;
    this.form.setValue(depto);  //passa o objeto para o formulario
  }

  //persiste os dados do formulário
  save() {
    this.departamentoService.createOrUpdate(this.form.value)
    //esconde o dialoge exibe alert   
    .then(() => {
        this.displayDialogDepartamento = false;
        Swal.fire(`Departamento ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success')
      })
      //Em caso de erro...
      .catch((erro) => {
        this.displayDialogDepartamento = false;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o departamento.`, `Detalhes: ${erro}`, 'error')
      })
    this.form.reset()
  }

  //excluir um departamento
  delete(depto: Departamento) {
    Swal.fire({
      title: 'Confirma a exclusão do departamento?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
      //verifica na Promise o resultado do click if e invoca o metodo do serviço
    }).then((result) => {
      if (result.value) {
        this.departamentoService.delete(depto.id)
          .then(() => {
            Swal.fire('Departamento excluído com sucesso!', '', 'success')
          })
      }
    })
  }
}
