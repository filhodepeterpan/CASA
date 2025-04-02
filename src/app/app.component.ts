import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  logado: boolean = false;

  constructor(private router : Router, private platform: Platform) {

    // botão de voltar
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url != "/home"){
        this.router.navigate(['/home']);
      }
    });

    // login
    this.logado = localStorage.getItem("logado") === "true";

    const modoEscuro = localStorage.getItem("modoEscuro") == "true";

    if(modoEscuro){
      document.documentElement.classList.add("dark");
    }
  }

  ngOnInit(){
    StatusBar.setOverlaysWebView({overlay: false});
    StatusBar.setBackgroundColor({color: "#000000"});
  }

  logout(saida: boolean){
    this.logado = saida;

    localStorage.setItem("logado", saida.toString());

    this.router.navigate(['/home']).then(() => {
      setTimeout(() => location.reload(), 100);
    });
  }

}
