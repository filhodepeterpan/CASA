import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // Variável para armazenar os cards recebidos pela API
  cards: any[] = [];
  // Variáveis para armazenar os dados do usuário para cadastro ou login
  nomeTutor: string = "";
  nomeCrianca: string = "";
  idCasa: string = "";
  email: string = "";
  usuario: string = "";
  senha: string = "";
  confirmacaoSenha: string = "";
  senhasIguais: boolean = false;
  private arduinoIP = '192.168.15.194';

  // Flags para controle do estado: logado, cadastro realizado e categoria escolhida
  logado: boolean = false;
  conectado: boolean = false;
  cadastrado: boolean = true;
  categoriaEscolhida: boolean = false;

  // Variável que armazena a categoria escolhida
  categoria: string = "";
  // Variável para gerenciar a reprodução de áudio
  audioTocando: HTMLAudioElement | null = null;
  // Indicador de estado de carregamento da página ou de requisições
  carregando?: boolean;
  // Variáveis que definem o tamanho das colunas para os cards e para a seção de login
  colSizeCard = '6';
  colSizeLoginSection = '12';
  // Flag para exibir ou ocultar a senha
  mostrarSenha: boolean = false;
  private enviaIDSubject = new Subject<{ id: number, cardImg: HTMLImageElement }>();

  // Lista de categorias com seus respectivos ícones e cores
  categorias = [
    { nome: 'Ajuda', icone: 'alert', cor: 'light' },
    { nome: 'Ações', icone: 'flash', cor: 'warning' },
    { nome: 'Alimentação', icone: 'fast-food', cor: 'danger' },
    { nome: 'Eventos', icone: 'balloon', cor: 'success' },
    { nome: 'Lugares', icone: 'business', cor: 'dark' },
    { nome: 'Necessidades', icone: 'hand-left', cor: 'primary' },
    { nome: 'Objetos', icone: 'dice', cor: 'warning' },
    { nome: 'Sentimentos', icone: 'happy', cor: 'danger' },
    { nome: 'Higiene', icone: 'medkit', cor: 'light' },
    { nome: 'Partes do Corpo', icone: 'body', cor: 'tertiary' },
    { nome: 'Respostas Curtas', icone: 'thumbs-up', cor: 'success' },
    { nome: 'Pessoas', icone: 'people', cor: 'dark' }
  ];

  // Construtor com injeção de dependências necessárias: HTTP, Platform, Router, AlertController e o serviço de usuário
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService, // Serviço para tratar login, cadastro, etc.
    private AuthService: AuthService
  ) {
    // Verifica a orientação da tela na inicialização
    this.checaOrientacao();

    // Subscrição para o botão de voltar (backButton) do dispositivo, com prioridade definida
    this.platform.backButton.subscribeWithPriority(10, () => {
      // Se estiver na página /home, com o usuário logado e categoria selecionada, chama o método para voltar à tela de escolha
      if (this.router.url === "/home" && this.logado && this.categoriaEscolhida) {
        this.volta();
      } else if (this.router.url === "/home") {
        // Se apenas estiver na página /home, encerra o aplicativo
        App.exitApp();
      }
    });

    this.enviaIDSubject.pipe(
      throttleTime(2000) // impede chamadas menores que 2 segundos
    ).subscribe(({ id, cardImg }) => {
      this.enviaIDInterno(id, cardImg);
    });

    // Define o estado de 'logado' verificando o valor no localStorage
    this.logado = localStorage.getItem("logado") === "true";
  }

  // Lifecycle do Angular: executado na inicialização do componente
  ngOnInit() {

    // URL da API que retorna os dados dos cards
    const apiUrl = 'https://api-pecs.vercel.app/cards.json';
    // Ativa o estado de carregamento
    this.carregando = true;

    this.conectado = localStorage.getItem("conectado") === "true";

    setInterval(() => {
      this.conectado = localStorage.getItem("conectado") === "true";
    }, 2000);

    // Realiza uma requisição HTTP GET para obter os cards
    this.http.get<any>(apiUrl).subscribe(
      (next) => {
        // Armazena os cards recebidos na variável e desativa o carregamento
        this.cards = next;
        this.carregando = false;
      },
      (error) => {
        // Em caso de erro, exibe o erro no console e desativa o carregamento
        console.error('Erro ao chamar a API', error);
        this.carregando = false;
      }
    );
  }

  // conexão via bluetooth

  // Usando o decorator @HostListener para escutar o evento de redimensionamento da janela
  @HostListener('window:resize', [])
  checaOrientacao() {
    // Ajusta o tamanho da coluna dos cards: se a largura for maior que a altura, utiliza tamanho 3; caso contrário, tamanho 6
    this.colSizeCard = window.innerWidth > window.innerHeight ? '2' : '6';
    // Ajusta o tamanho da seção de login conforme a orientação da tela
    this.colSizeLoginSection = window.innerWidth > window.innerHeight ? '6' : '12';
  }



  // Exibe a tela de cadastro alterando o flag 'cadastrado'
  solicitaCadastro() {
    this.cadastrado = false;
  }


  // Método responsável por enviar os dados de cadastro à API
  finalizaCadastro() {
    this.senhasIguais = this.senha == this.confirmacaoSenha;

    if (!this.senhasIguais) {
      this.apresentaAlertaSenhas();
    }
    else {
      // Cria um objeto com os dados do usuário para cadastro
      const usuarioCadastro = {
        nome_tutor: this.nomeTutor,
        nome_crianca: this.nomeCrianca,
        id_casa: this.idCasa,
        email: this.email,
        usuario: this.usuario,
        senha: this.senha,
        icone: 'padrao'
      };

      // Imprime no console os dados a serem enviados para auxiliar no debug
      console.log('Enviando dados para cadastro:', usuarioCadastro);

      // Chama o método cadastrar do serviço de usuário, que retorna um Observable
      this.usuarioService.cadastrar(usuarioCadastro).subscribe(
        (res: any) => {
          if (res.status === "sucesso") {
            this.apresentaAlertaCadastro(res.message);
            this.cadastrado = true;
            this.router.navigate(["/home"]);
          } else {
            this.apresentaAlertaErro(res.message);
          }
        },
        (err) => {
          // Extrai a mensagem de erro do payload da resposta, se existir
          const erroMsg = err.error && err.error.message
            ? err.error.message
            : "Erro na comunicação com o servidor.";
          this.apresentaAlertaErro(erroMsg);
        }
      );


    }

  }

  // Função assíncrona que cria e apresenta um alerta informando que o cadastro foi realizado com sucesso
  async apresentaAlertaCadastro(msg: string) {
    const alert = await this.alertController.create({
      header: 'Cadastro realizado!',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Função assíncrona que cria e apresenta um alerta informando sobre erros no cadastro
  async apresentaAlertaErro(msg: string) {
    const alert = await this.alertController.create({
      header: 'Erro no cadastro!',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async apresentaAlertaSenhas() {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: 'As senhas não coincidem.',
      cssClass: 'alerta-alteracao',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Método que limpa os campos de entrada (inputs) do formulário
  limpaFormulario() {
    // Seleciona todos os elementos input presentes no documento
    const inputs = document.querySelectorAll("input");

    // Itera sobre cada input e define seu valor como string vazia
    inputs.forEach(input => {
      (input as HTMLInputElement).value = "";
    });
  }

  // Método que retorna à tela de login, definindo o flag 'cadastrado' e limpando o formulário
  voltaLogin() {
    this.cadastrado = true;
    this.limpaFormulario();
  }

  // Método para efetuar o login do usuário utilizando o serviço UsuarioService
  async login(form: NgForm) {
    // Se o formulário estiver inválido, interrompe o processo de login
    if (form.invalid) {
      return;
    }

    // Realiza a chamada do serviço de login passando os dados de usuário e senha
    this.usuarioService.login(this.usuario, this.senha).subscribe(
      (res: any) => {
        // Se a resposta indicar sucesso, atualiza o estado de logado e armazena as informações do usuário
        if (res.status === "sucesso") {
          if (res.data) {
            this.AuthService.setId(res.data.id);

            localStorage.setItem("casaID", res.data.id_casa);
            localStorage.setItem("nomeTutor", res.data.nome_tutor);
            localStorage.setItem("nomeCrianca", res.data.nome_crianca);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("usuario", res.data.usuario);
            localStorage.setItem("fotoDePerfil", res.data.icone);

            // Recarrega a página para refletir as mudanças de estado
            this.AuthService.atualizarLoginStatus();
            this.router.navigate(['/home']);

          }

          this.logado = true;
          localStorage.setItem("logado", "true");
          this.limpaFormulario();
          // Se houver dados complementares do usuário, armazena-os no localStorage
          console.log("Login realizado com sucesso!", res.data);
          location.reload();
        }
        else {
          // Em caso de erro no login, exibe alerta informando o motivo
          this.apresentaAlertaErroLogin(res.message || "Usuário ou senha inválidos.");
          console.error("Erro ao fazer login:", res.message);
        }
      },
      (err: any) => {
        // Caso ocorra algum erro na requisição HTTP para login, registra o erro no console
        console.error("Erro na requisição HTTP:", err);
      }
    );
  }

  // Método para alternar a visibilidade da senha (mostrar ou ocultar)
  alternaVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  // Função assíncrona para exibir um alerta de erro durante o login
  async apresentaAlertaErroLogin(msg: string) {
    const alert = await this.alertController.create({
      header: 'Erro ao fazer login',
      message: msg,
      buttons: ['Tentar novamente']
    });
    await alert.present();
  }

  // Método para selecionar uma categoria e iniciar o processo de filtragem dos cards
  selecionaCategoria(categoria: any) {
    // Ativa o estado de carregamento para informar ao usuário que algo está sendo processado
    this.carregando = true;
    // Define que uma categoria foi selecionada
    this.categoriaEscolhida = true;
    // Armazena a categoria escolhida (apenas o nome)
    this.categoria = categoria.nome;

    // Após um curto intervalo (300ms), desativa o estado de carregamento
    setTimeout(() => { this.carregando = false; }, 300);
  }

  // Getter que retorna os cards filtrados pela categoria atual e ordenados alfabeticamente pelo título
  get cardsFiltrados() {
    return this.cards
      .filter(c => c.categoria === this.categoria)
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  // Método para voltar à tela de seleção de categorias
  volta() {
    this.categoriaEscolhida = false;
    this.categoria = "";
  }

  // Método para reproduzir o áudio associado a um card selecionado
  escolheCard(url: string) {
    // Se já existe um áudio tocando e ele ainda não terminou, interrompe a execução
    if (this.audioTocando && !this.audioTocando.ended) {
      return;
    }

    // Cria um novo objeto de áudio com a URL fornecida e inicia sua reprodução
    this.audioTocando = new Audio(url);
    this.audioTocando.play();

    // Ao terminar de reproduzir, redefine a variável para permitir novas reproduções
    this.audioTocando.onended = () => {
      this.audioTocando = null;
    };
  }

  // Método que envia o ID para o arduino
  enviaID(id: number, cardImg: HTMLImageElement) {
    console.log("funcao externa chamada");
    this.enviaIDSubject.next({ id, cardImg });
  }

  private async enviaIDInterno(id: number, cardImg: HTMLImageElement) {
    console.log("funcao interna chamada");

    if (this.conectado) {
      const firebaseUrl = (environment as any).firebaseURL_ID;
      const data = { id: id };

      cardImg.style.filter = 'brightness(0.8)';

      try {
        const response = await fetch(firebaseUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
      }
      catch (error: any) {
        if (error instanceof TypeError) {
          console.error('Erro de rede:', error);
        } else {
          console.error('Erro:', error.message || error);
        }
      }
      finally {
        setTimeout(() => {
          cardImg.style.filter = 'brightness(1)';
        }, 1000);
      }
    }
    else {
      const alert = await this.alertController.create({
        header: 'Dispositivo desconectado',
        message: 'Abra o menu e conecte o dispositivo antes de escolher um card.',
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

}
