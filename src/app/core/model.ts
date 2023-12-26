import { classToPlain } from "class-transformer";

//esta classe é um modelo, possui apenas uma propriedade id
export abstract class Model {
  //Desta forma você não precisa implementar um valor para a variável.
  id!: string;

  toObject(): object {
    let obj: any = classToPlain(this);
    delete obj.id;
    return obj;
  }
}