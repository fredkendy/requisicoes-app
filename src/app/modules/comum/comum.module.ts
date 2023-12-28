import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';



@NgModule({
  declarations: [],
  imports: [
    //diretivas basicas como o *ngIf e *ngFor
    CommonModule,
    FormsModule,
    PrimeNGModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule
  ]
})
export class ComumModule { }
