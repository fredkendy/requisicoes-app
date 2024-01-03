import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';

import { NgSelectModule } from '@ng-select/ng-select';

//corrigindo erros do p-dialog
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    RequisicaoComponent
  ],
  imports: [
    CommonModule,
    RequisicaoRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class RequisicaoModule { }
