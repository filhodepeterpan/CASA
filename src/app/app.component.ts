import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  logado: boolean = false;

  constructor(private router : Router) {
    this.logado = localStorage.getItem("logado") === "true";

    const modoEscuro = localStorage.getItem("modoEscuro") == "true";

    if(modoEscuro){
      document.documentElement.classList.add("dark");
    }
  }

  logout(saida: boolean){
    this.logado = saida;

    localStorage.setItem("logado", saida.toString());

    this.router.navigate(['/home']).then(() => {
      setTimeout(() => location.reload(), 100);
    });
  }

}
