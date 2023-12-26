import { Departamento } from "./departamento.model";
import { Model } from "../core/model";

export class Funcionario extends Model {
    nome!: string;
    funcao!: string;
    email!: string;
    ultimoAcesso: any;
    //departamento refere-se ao tipo da classe criada em departamento.model.ts
    departamento!: Departamento;
}
