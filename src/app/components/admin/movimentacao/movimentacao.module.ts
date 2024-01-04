import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { MovimentacaoRoutingModule } from './movimentacao-routing.module';

//corrigindo erros do p-dialog
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    MovimentacaoRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class MovimentacaoModule { }
