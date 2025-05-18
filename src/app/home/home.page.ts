import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  cards: any[] = [];
  nomeTutor: string = "";
  nomeCrianca: string = "";
  idCasa: string = "";
  email: string = "";
  usuario: string = "";
  senha: string = "";
  logado: boolean = false;
  cadastrado: boolean = true;
  categoriaEscolhida: boolean = false;
  categoria: string = "";
  audioTocando: HTMLAudioElement | null = null;
  carregando?: boolean;
  colSizeCard = '6';
  colSizeLoginSection = '12';
  mostrarSenha: boolean = false;

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

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService // Injeta o serviço de usuário
  ) {
    this.checaOrientacao();

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === "/home" && this.logado && this.categoriaEscolhida) {
        this.volta();
      } else if (this.router.url === "/home") {
        App.exitApp();
      }
    });

    this.logado = localStorage.getItem("logado") === "true";
  }

  ngOnInit() {
    const apiUrl = 'https://api-pecs.vercel.app/cards.json';
    this.carregando = true;

    this.http.get<any>(apiUrl).subscribe(
      (next) => {
        this.cards = next;
        this.carregando = false;
      },
      (error) => {
        console.error('Erro ao chamar a API', error);
        this.carregando = false;
      }
    );
  }

  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSizeCard = window.innerWidth > window.innerHeight ? '3' : '6';
    this.colSizeLoginSection = window.innerWidth > window.innerHeight ? '6' : '12';
  }

  solicitaCadastro() {
    this.cadastrado = false;
  }

  // Método para enviar os dados do cadastro usando o UsuarioService
  finalizaCadastro() {
    // Cria objeto com os dados do cadastro
    const usuarioCadastro = {
      nome_tutor: this.nomeTutor,
      nome_crianca: this.nomeCrianca,
      id_casa: this.idCasa,
      email: this.email,
      usuario: this.usuario,
      senha: this.senha,
    };

    console.log('Enviando dados para cadastro:', usuarioCadastro);

    this.usuarioService.cadastrar(usuarioCadastro).subscribe(
      (res: any) => {
        if (res.status === "sucesso") {
           this.apresentaAlertaCadastro(res.message);
          console.log('Cadastro realizado:', res);
          this.cadastrado = true;
          this.limpaFormulario();
        } else {
          alert("Erro ao cadastrar: " + res.message);
          console.error('Erro no cadastro:', res);
        }
      },
      (err) => {
        alert("Erro de conexão com a API. Tente novamente mais tarde.");
        console.error('Erro HTTP:', err);
      }
    );
  }

  async apresentaAlertaCadastro(msg: string) {
    const alert = await this.alertController.create({
      header: 'Cadastro realizado!',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

limpaFormulario(){
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input =>{
    (input as HTMLInputElement).value = "";
  });
}

voltaLogin() {
  this.cadastrado = true;
  this.limpaFormulario();
}

  // Método para efetuar o login usando o UsuarioService
async login(form: NgForm) {
  if (form.invalid) {
    return;
  }

  this.usuarioService.login(this.usuario, this.senha).subscribe(
    (res: any) => {
      if (res.status === "sucesso") {
        this.logado = true;
        // Armazena as informações do usuário no localStorage
        localStorage.setItem("logado", "true");
        this.limpaFormulario();
        if (res.data) {
          localStorage.setItem("id", res.data.id.toString());
          localStorage.setItem("casaID", res.data.id_casa);
          localStorage.setItem("nomeTutor", res.data.nome_tutor);
          localStorage.setItem("nomeCrianca", res.data.nome_crianca);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("usuario", res.data.usuario);

          location.reload();
        }
        console.log("Login realizado com sucesso!", res.data);
      } 
      else {
        this.apresentaAlertaErroLogin(res.message || "Usuário ou senha inválidos.");
        console.error("Erro ao fazer login:", res.message);
      }
    },
    (err: any) => {
      this.apresentaAlertaErroLogin("Erro de conexão com a API.");
      console.error("Erro na requisição HTTP:", err);
    }
  );
}

alternaVisibilidadeSenha(){
  this.mostrarSenha = !this.mostrarSenha;
}

async apresentaAlertaErroLogin(msg: string) {
  const alert = await this.alertController.create({
    header: 'Erro ao fazer login',
    message: msg,
    buttons: ['Tentar novamente']
  });
  await alert.present();
}

  selecionaCategoria(categoria: any) {
    this.carregando = true;
    this.categoriaEscolhida = true;
    this.categoria = categoria.nome;

    setTimeout(() => { this.carregando = false; }, 300);
  }

  get cardsFiltrados() {
    return this.cards
      .filter(c => c.categoria === this.categoria)
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  volta() {
    this.categoriaEscolhida = false;
    this.categoria = "";
  }

  escolheCard(url: string) {
    if (this.audioTocando && !this.audioTocando.ended) {
      return;
    }

    this.audioTocando = new Audio(url);
    this.audioTocando.play();

    this.audioTocando.onended = () => {
      this.audioTocando = null;
    };
  }
}
