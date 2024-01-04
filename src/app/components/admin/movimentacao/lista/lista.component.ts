import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Funcionario } from '../../../../models/funcionario.model';
import { Movimentacao, Requisicao } from '../../../../models/requisicao.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequisicaoService } from '../../../../services/requisicao.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {

  //Decorator Input: objetos cujos valores receberemos de outros componentes (ex: lista de movs, funcionarioLogado (atual funcionario na aplicação))
  @Input() movimentacoes!: Movimentacao[];
  @Input() requisicaoSelecionada!: Requisicao;
  @Input() displayDialogMovimentacoes!: boolean;
  @Input() funcionarioLogado!: Funcionario;
  //Decorator Output: ordem inversa da emissão do evento: fluxo do componente filho que emite um evento para o pai
  //Neste caso, displayChange informa para o pai o fechamento do dialog (instancia EventEmitter)
  @Output() displayChange = new EventEmitter();

  listaStatus!: string[];
  displayDialogMovimentacao!: boolean;
  form!: FormGroup;
  edit!: boolean;
  //guarda o índice da tabela de movimentações (realizar operações de atualização e exclusão)
  indexMovimentacoes!: number;

  //redução de declarações no construtor, por conta do @Input, cujos valores serão recebidos da classe pai
  constructor(private requisicaoService: RequisicaoService, private fb: FormBuilder) { }

  ngOnInit() {
    this.configForm();
    this.carregaStatus();
  }

  //Configuração do formulário
  configForm() {
    this.form = this.fb.group({
      funcionario: new FormControl('', Validators.required),
      dataHora: new FormControl(''),
      status: new FormControl('', Validators.required),
      descricao: new FormControl('', Validators.required)
    })
  }

  //Configuração da lista de status (possibilidades de status para um movimento)
  carregaStatus() {
    this.listaStatus = ['Aberto', 'Pendente', 'Processando', 'Não autorizada', 'Finalizado'];
  }

  //parametros: movimento e o índice do array 
  selecionaMovimento(mov: Movimentacao, index: number) {
    this.edit = true;
    this.displayDialogMovimentacao = true;
    this.form.setValue(mov);
    this.indexMovimentacoes = index
  }

  //Método para fechar o dialog (informa 'false' no parametro do metodo emit(): informa a emissão do evento para o pai, fechando o dialog)
  onClose() {
    this.displayChange.emit(false);
  }

  //atualiza a movimentação
  update() {
    //atualizamos movimentacoes com os valores do formulario, com base na posição do array
    this.movimentacoes[this.indexMovimentacoes] = this.form.value
    //atualizamos o array de movimentacoes, status atual da requisicao selecionada e Date
    this.requisicaoSelecionada.movimentacoes = this.movimentacoes;
    this.requisicaoSelecionada.status = this.form.controls['status'].value
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
    //efetiva a atualização do registro
    this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
      .then(() => {
        this.displayDialogMovimentacao = false;
        Swal.fire(`Movimentação ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogMovimentacao = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Movimentação.`, `Detalhes: ${erro}`, 'error');
      })
    this.form.reset()
  }

  //filter retorna um novo array com todos os elementos, exceto o informado no parâmetro da função em el !== element
  remove(array: any[], element: Movimentacao) {
    return array.filter((el: any) => el !== element);
  }

  //parametro é o objeto de movimento 
  delete(mov: Movimentacao) {
    //recebe o array sem o elemento excluido
    const movs = this.remove(this.movimentacoes, mov)
    Swal.fire({
      title: 'Confirma a exclusão da Movimentação?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      //diante da confirmação do usuário, atualiza o registro da requisicao com o novo array (nao chamamos o método de exclusão)
      if (result.value) {
        this.requisicaoSelecionada.movimentacoes = movs;
        this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
          .then(() => {
            Swal.fire('Movimentação excluída com sucesso!', '', 'success')
            this.movimentacoes = movs;
          })
      }
    })
  }

}
