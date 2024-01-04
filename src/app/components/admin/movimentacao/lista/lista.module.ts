import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaRoutingModule } from './lista-routing.module';

//corrigindo erros do p-dialog
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ListaRoutingModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class ListaModule { }
