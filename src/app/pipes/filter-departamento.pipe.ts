import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  //atributo name para informar no template
  name: 'filterDepartamento'
})
export class FilterDepartamentoPipe implements PipeTransform {

  //value representa o array que será o valor original (lista de funcionarios). 
  //filtro é o departamento no qual queremos ver os registros de funcionarios
  transform(value: any, filtro: any): any {
    //primeiro if, retorna lista sem filtro
    if (filtro == 'TODOS') return value;
    //segundo if, se existe lista value, invoca o filter comparando cada nome do objeto departamento com o valor do filtro elem.departamento.nome === filtro 
    if (value) {
      //@ts-ignore
      return value.filter(elem => (elem.departamento.nome === filtro))
    }
  }

}
