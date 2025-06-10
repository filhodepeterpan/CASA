import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GerenciamentoPageRoutingModule } from './gerenciamento-routing.module';

import { GerenciamentoPage } from './gerenciamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GerenciamentoPageRoutingModule
  ],
  declarations: [GerenciamentoPage]
})
export class GerenciamentoPageModule {}
