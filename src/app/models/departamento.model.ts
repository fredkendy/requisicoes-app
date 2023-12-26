import { Model } from "../core/model";

export class Departamento extends Model {
    nome!: string;
    //'?' significa campo opcional
    telefone?: string;
}
