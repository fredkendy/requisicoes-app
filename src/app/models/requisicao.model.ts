import { Departamento } from "./departamento.model";
import { Funcionario } from "./funcionario.model";
import { Model } from "../core/model"

//Este arquivo possui 2 classes, pois cada requisicao gera um registro de movimento
export class Requisicao extends Model {
    solicitante!: Funcionario;
    dataAbertura: any;
    ultimaAtualizacao: any;
    descricao!: string;
    status!: string;
    //departamento responsável pela demanda
    destino!: Departamento;
    //representa o histórico de movimentações
    movimentacoes!: Movimentacao[];
}

//funcionario que mudou o status da requisicao, data e hora e a descricao da movimentação
export class Movimentacao extends Model {
    funcionario!: Funcionario;
    dataHora!: Date;
    status!: string;
    descricao!: string;
}