import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciamentoPage } from './gerenciamento.page';

const routes: Routes = [
  {
    path: '',
    component: GerenciamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciamentoPageRoutingModule {}
