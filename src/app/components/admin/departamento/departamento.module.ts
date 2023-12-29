import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
//import { SharedModule } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    DepartamentoComponent
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    //SharedModule,   //exporta outros modulos necessarios ao componente (ex: modulos de cada componente visual dp primeng)
    ReactiveFormsModule,
    DialogModule
  ]
})
export class DepartamentoModule { }
