import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Departamento } from '../../../models/departamento.model';
import { Funcionario } from '../../../models/funcionario.model';
import { Requisicao } from '../../../models/requisicao.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { RequisicaoService } from '../../../services/requisicao.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrl: './requisicao.component.css'
})
export class RequisicaoComponent implements OnInit {

  requisicoes$!: Observable<Requisicao[]>;
  //lista de departamentos para indicar o destino da requisição
  departamentos$!: Observable<Departamento[]>;
  edit!: boolean;
  displayDialogRequisicao!: boolean;
  form!: FormGroup;
  //consultar o funcionario que esta logado
  funcionarioLogado!: Funcionario;

  //injeta as classes de serviços e formularios
  constructor(private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    //classe de autenticação para recuperar o usuario autenticado
    private auth: AuthenticationService,
    private funcionarioService: FuncionarioService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.departamentos$ = this.departamentoService.list();
    this.configForm();
    this.recuperaFuncionario()
  }

  async recuperaFuncionario() {
    await this.auth.authUser()
      .subscribe(dados => {
        //passa o email do metodo authUser
        //@ts-ignore
        this.funcionarioService.getFuncionarioLogado(dados.email)
          .subscribe(funcionarios => {
            //recupera o usuario no primeira posicao do array
            this.funcionarioLogado = funcionarios[0];
            //console.log(this.funcionarioLogado)
            this.requisicoes$ = this.requisicaoService.list()
              .pipe(
                //mostrar somente requisições incluídas pelo usuário logado (compara propriedades do email do solicitante da requisicao com o do funcionario logado)
                map((reqs: Requisicao[]) => reqs.filter(r => r.solicitante.email === this.funcionarioLogado.email))
              )
          })
      })
  }

  configForm() {
    this.form = this.fb.group({
      id: new FormControl(),
      destino: new FormControl('', Validators.required),
      solicitante: new FormControl(''),
      dataAbertura: new FormControl(''),
      ultimaAtualizacao: new FormControl(''),
      status: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      movimentacoes: new FormControl('')
    })
  }

  add() {
    this.form.reset();
    this.edit = false;
    this.displayDialogRequisicao = true;
    this.setValorPadrao();
  }

  //setar valores-padrão na abertura de toda requisição
  setValorPadrao() {
    //faz atualizacao parcial nos campos do formulario
    this.form.patchValue({
      solicitante: this.funcionarioLogado,
      status: 'Aberto',
      dataAbertura: new Date(),
      ultimaAtualizacao: new Date(),
      movimentacoes: []
    })
  }

  //abaixo os trechos são similares aos outros componentes
  selecionaRequisicao(func: Requisicao) {
    this.edit = true;
    this.displayDialogRequisicao = true;
    this.form.setValue(func);
  }

  save() {
    
    this.requisicaoService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogRequisicao = false;
        Swal.fire(`Requisição ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success')
        this.displayDialogRequisicao = false;
      })
      .catch((erro) => {
        this.displayDialogRequisicao = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Requisição.`, `Detalhes: ${erro}`, 'error')
      })
    this.form.reset()
  }

  delete(depto: Requisicao) {
    Swal.fire({
      title: 'Confirma a exclusão do Requisição?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.requisicaoService.delete(depto.id)
          .then(() => {
            Swal.fire('Requisição excluído com sucesso!', '', 'success')
          })
      }
    })
  }

}
