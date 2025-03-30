import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  logado: boolean = false;

  constructor() {
    this.logado = localStorage.getItem("logado") === "true";

    const modoEscuro = localStorage.getItem("modoEscuro") == "true";

    if(modoEscuro){
      document.documentElement.classList.add("dark");
    }
  }

  logout(saida: boolean){
    this.logado = saida;

    localStorage.setItem("logado", saida.toString());

    location.reload();
  }

}
