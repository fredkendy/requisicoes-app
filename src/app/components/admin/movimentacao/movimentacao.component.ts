import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Funcionario } from '../../../models/funcionario.model';
import { Requisicao, Movimentacao } from '../../../models/requisicao.model';
import { RequisicaoService } from '../../../services/requisicao.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.css'
})
export class MovimentacaoComponent implements OnInit {

  //indicamos o funcionarioLogado (email) como uma propriedade de entrada
  //ao detectar alterações, angular atualiza propriedades dos dados com o valor informado no componente pai
  @Input() funcionarioLogado!: Funcionario;
  //2 listas para exibir as requisições/movimentações
  requisicoes$!: Observable<Requisicao[]>;
  movimentacoes!: Movimentacao[];
  requisicaoSelecionada!: Requisicao;
  edit!: boolean;
  //2 propriedades para exibição de dialogs
  displayDialogMovimentacao!: boolean;
  displayDialogMovimentacoes!: boolean;
  form!: FormGroup;
  //exibe opções de status para a movimentação
  listaStatus!: string[];

  constructor(private requisicaoService: RequisicaoService, private fb: FormBuilder) { }

  //definir campos do formulário, listar requisições, carregar opções de status
  ngOnInit() {
    this.configForm();
    this.carregaStatus();
    this.listaRequisicoesDepartamento();
  }

  configForm() {
    this.form = this.fb.group({
      funcionario: new FormControl('', Validators.required),
      dataHora: new FormControl(''),
      status: new FormControl('', Validators.required),
      descricao: new FormControl('', Validators.required)
    })
  }

  carregaStatus() {
    //opções definidas entre colchetes
    this.listaStatus = ['Aberto', 'Pendente', 'Processando', 'Não autorizada', 'Finalizado'];
  }

  listaRequisicoesDepartamento() {
    this.requisicoes$ = this.requisicaoService.list()
    //listar somente as requisições do departamento do funcionário (compara em cada objeto r o nome do departamento)
      .pipe(
        map((reqs: Requisicao[]) => reqs.filter(r => r.destino.nome === this.funcionarioLogado.departamento.nome))
      )
  }

  //adicionar uma nova requisição. parametro é a requisicao que será selecionada no template do componente
  add(requisicao: Requisicao) {
    this.form.reset();
    this.edit = false;
    this.setValorPadrao();
    //otribuimos a esta variável o objeto requisicao
    this.requisicaoSelecionada = requisicao;
    //verificar a existencia de valores
    this.movimentacoes = (!requisicao.movimentacoes ? [] : requisicao.movimentacoes);
    this.displayDialogMovimentacao = true;
  }

  setValorPadrao() {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      dataHora: new Date()
    })
    this.movimentacoes = [];
  }

  //persistimos as movimentações, atualizando alguns campos da requisicao, como a ultima atualização
  save() {
    //adiciona a movimentacao no array com os valores do formulário
    this.movimentacoes.push(this.form.value);
    this.requisicaoSelecionada.movimentacoes = this.movimentacoes;
    this.requisicaoSelecionada.status = this.form.controls['status'].value
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
    this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
      .then(() => {
        this.displayDialogMovimentacao = false;
        Swal.fire(`Requisição ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogMovimentacao = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Requisição.`, `Detalhes: ${erro}`, 'error');
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

  //visualizar as movimentações da requisição
  verMovimentacoes(requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.movimentacoes = requisicao.movimentacoes;
    this.displayDialogMovimentacoes = true;
  }

  //fechar o dialog do proximo componente
  onDialogClose(event: boolean) {
    this.displayDialogMovimentacoes = event;
  }
  
}
