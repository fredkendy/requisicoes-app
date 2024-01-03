import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { FuncionarioComponent } from './funcionario.component';

//facilitar operações com campos do tipo dropdown
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

//Declarando o pipe (filtro)
import { FilterDepartamentoPipe } from '../../../pipes/filter-departamento.pipe';


@NgModule({
  declarations: [
    FuncionarioComponent,
    FilterDepartamentoPipe
  ],
  imports: [
    CommonModule,
    FuncionarioRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  providers: [
    FilterDepartamentoPipe
  ]
})
export class FuncionarioModule { }
