import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AuthService } from './services/auth.service';
import { Platform, MenuController, AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  logado: boolean = false;
  dispositivoConectado: boolean = false;
  corBotaoConexao: string = "primary";
  private arduinoIP: string = '192.168.15.194';
  fotoDePerfil: string = "padrao"
  usuarioLogado: string = "";
  nomeCrianca: string = "";
  acessoDeAdministrador: boolean = false;
  carregandoConexao: boolean = false;

  constructor(private router: Router,
    private platform: Platform,
    private menu: MenuController,
    private alertController: AlertController,
    private toastController: ToastController,
    private AuthService: AuthService,
  ) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url != "/home") {
        window.history.back();
      }
    });



    this.logado = localStorage.getItem("logado") === "true";
    this.nomeCrianca = localStorage.getItem("nomeCrianca") || "";
    this.usuarioLogado = "@" + localStorage.getItem("usuario") || "Desconectado";

    if (this.usuarioLogado == "@casa") {
      this.acessoDeAdministrador = true;
    }

    this.AuthService.logado$.subscribe((status) => {
      this.logado = status;

      if (status) {
        this.nomeCrianca = localStorage.getItem("nomeCrianca") || "";
        const usuario = localStorage.getItem("usuario");
        this.usuarioLogado = usuario ? `@${usuario}` : "Desconectado";

        const iconeSalvo = localStorage.getItem('fotoDePerfil');
        if (iconeSalvo) {
          this.fotoDePerfil = iconeSalvo;
          this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
        }

        const modoEscuro = localStorage.getItem("modoEscuro") == "true";
        if (modoEscuro) {
          document.documentElement.classList.add("dark");
        }
      }
    });


    const modoEscuro = localStorage.getItem("modoEscuro") == "true";

    if (modoEscuro) {
      document.documentElement.classList.add("dark");
    }

  }

  ngOnInit() {

    setInterval(() => {
      this.monitoraConexao();
    }, 2000);
    setInterval(() => {
      localStorage.setItem("conectado", this.dispositivoConectado.toString());
    }, 2000);

    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setBackgroundColor({ color: "#000000" });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const logado = localStorage.getItem('logado') === 'true';
      const rotaAtual = this.router.url;

      if (!logado && rotaAtual !== '/home') {
        this.router.navigate(['/home']);
      }
    });

  }


  perfil: { foto: string } = {
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
            localStorage.removeItem("logado"); // não permite que o logado seja alterado pra true manualmente, uma vez que é removido

            // remove informações do local storage para não vazar
            localStorage.removeItem("id");
            localStorage.removeItem("casaID");
            localStorage.removeItem("nomeTutor");
            localStorage.removeItem("nomeCrianca");
            localStorage.removeItem("email");
            localStorage.removeItem("usuario");
            localStorage.removeItem("fotoDePerfil");
            localStorage.removeItem("iconeSelecionado");

            this.AuthService.atualizarLoginStatus();

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

  conectaDispositivo() {
    this.verificaConexao();
  }

  async verificaConexao() {
    this.carregandoConexao = true;

    const firebaseUrl = (environment as any).firebaseURL_STATUS;

    try {
      const response = await fetch(firebaseUrl);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Resposta do FIREBASE: ", responseData);

      if (responseData?.online === true && responseData.timestamp) {
        const agora = Date.now();
        const tempoUltimaAtualizacao = agora - responseData.timestamp;

        console.log('Tempo desde a última atualização (ms):', tempoUltimaAtualizacao);

        if (tempoUltimaAtualizacao <= 15000) {
          // Conexão ativa
          this.dispositivoConectado = true;
          this.corBotaoConexao = "success";

          const toast = await this.toastController.create({
            message: 'Dispositivo conectado!',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        } else {
          // Considera offline por falta de atualização recente
          this.dispositivoConectado = false;
          this.corBotaoConexao = "primary";

          const toast = await this.toastController.create({
            message: 'Dispositivo desconectado ou sem resposta!',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
        }
      } else {
        // Considera offline se não houver online true ou timestamp
        this.dispositivoConectado = false;
        this.corBotaoConexao = "primary";

        const toast = await this.toastController.create({
          message: 'Dispositivo desconectado ou não encontrado',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
      }
    }
    catch (error: any) {
      console.log('Erro ao conectar:', error);
      this.dispositivoConectado = false;
      this.corBotaoConexao = "primary";

      const alert = await this.alertController.create({
        header: 'Conexão indisponível',
        message: 'O aplicativo falhou em buscar o status do CASA. Certifique-se de que ambos estão conectados a internet.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Tentar novamente',
            handler: () => { this.verificaConexao() }
          }
        ]
      });
      await alert.present();

      if (error instanceof TypeError) {
        console.error('Erro na requisição:', error);
      } else {
        console.error('Erro:', error.message || error);
      }
    }
    finally {
      this.carregandoConexao = false;
      localStorage.setItem("conectado", this.dispositivoConectado.toString());
    }
  }

  async monitoraConexao() {
    const firebaseUrl = (environment as any).firebaseURL_STATUS;

    try {
      const response = await fetch(firebaseUrl);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Status: ", responseData);

      if (responseData?.online === true && responseData.timestamp) {
        const agora = Date.now();
        const tempoUltimaAtualizacao = agora - responseData.timestamp;

        console.log('Tempo desde a última atualização (ms):', this.formataTempo(tempoUltimaAtualizacao));

        if (tempoUltimaAtualizacao <= 15000) {
          // Está online
          this.dispositivoConectado = true;
          this.corBotaoConexao = "success";
        } else {
          // Passou de 15 segundos, considera offline
          this.dispositivoConectado = false;
          this.corBotaoConexao = "primary";
        }
      } else {
        // Se não tem online true ou timestamp, considera offline
        this.dispositivoConectado = false;
        this.corBotaoConexao = "primary";
      }
    }
    catch (error: any) {
      console.error("Erro ao monitorar conexão:", error);
      this.dispositivoConectado = false;
      this.corBotaoConexao = "primary";
    }
    finally {
      localStorage.setItem("conectado", this.dispositivoConectado.toString());
    }
  }

  formataTempo(ms: number): string {
    const segundosTotais = Math.floor(ms / 1000);

    const dias = Math.floor(segundosTotais / 86400);
    const horas = Math.floor((segundosTotais % 86400) / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }

  fechaMenu() {
    this.menu.close();
  }

}
