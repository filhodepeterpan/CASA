import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform, MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  logado: boolean = false;
  fotoDePerfil : string = "padrao"
  usuarioLogado: string = "";
  nomeCrianca: string = "";

  constructor(private router : Router, private platform: Platform, private menu: MenuController, private alertController: AlertController) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url != "/home"){
        window.history.back();
      }
    });

    this.logado = localStorage.getItem("logado") === "true";
    this.nomeCrianca = localStorage.getItem("nomeCrianca") || "";
    this.usuarioLogado = "@" + localStorage.getItem("usuario") || "Desconectado";

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

async logout(saida: boolean) {
  const alert = await this.alertController.create({
    header: 'Deseja sair?',
    message: 'Você será desconectado do aplicativo.',
    cssClass: 'alerta-alteracao',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-cancelar'
      },
      {
        text: 'Sair',
        handler: () => {
          this.logado = saida;
          localStorage.setItem("logado", saida.toString());

          this.router.navigate(['/home']).then(() => {
            setTimeout(() => location.reload(), 100);
          });
        },
        cssClass: 'alert-button-sair'
      }
    ]
  });

  await alert.present();
}

  fechaMenu(){
    this.menu.close();
  }

}
