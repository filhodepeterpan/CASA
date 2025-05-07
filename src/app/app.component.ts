import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  logado: boolean = false;
  fotoDePerfil : string = "padrao"

  constructor(private router : Router, private platform: Platform, private menu: MenuController) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url != "/home"){
        window.history.back();
      }
    });

    this.logado = localStorage.getItem("logado") === "true";

    const modoEscuro = localStorage.getItem("modoEscuro") == "true";

    if(modoEscuro){
      document.documentElement.classList.add("dark");
    }

  }

  ngOnInit(){
    StatusBar.setOverlaysWebView({overlay: false});
    StatusBar.setBackgroundColor({color: "#000000"});

    const iconeSalvo = localStorage.getItem('fotoDePerfil');
    if (iconeSalvo) {
      this.fotoDePerfil = iconeSalvo;
      this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
    }
  }

  perfil: {foto: string} = {
    foto: `assets/perfil-icons/${this.fotoDePerfil}.png`
  };

  logout(saida: boolean){
    this.logado = saida;

    localStorage.setItem("logado", saida.toString());

    this.router.navigate(['/home']).then(() => {
      setTimeout(() => location.reload(), 100);
    });
  }

  fechaMenu(){
    this.menu.close();
  }

}
