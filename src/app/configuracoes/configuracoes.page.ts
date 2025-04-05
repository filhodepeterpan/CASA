import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false
})
export class ConfiguracoesPage implements OnInit {

  modoEscuro : boolean = false;

  constructor() { 
    this.modoEscuro = localStorage.getItem("modoEscuro") == "true";
    this.aplicaModoEscuro();
  }

  ngOnInit() {
  }

  toggleModoEscuro(event: any){
    this.modoEscuro = event.detail.checked;
    localStorage.setItem("modoEscuro", this.modoEscuro.toString());
    
    this.aplicaModoEscuro();
  }

  aplicaModoEscuro(){
    const aplicativo = document.documentElement;

    this.modoEscuro == true? aplicativo.classList.add("dark") : aplicativo.classList.remove("dark");
  }

  atualizaCadastro(){}

}
