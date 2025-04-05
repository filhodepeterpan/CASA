import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  cards: any[] = [];
  usuario: string = "";
  senha: string = "";
  logado: boolean = false;
  cadastrado: boolean = true;
  categoriaEscolhida: boolean = false;
  categoria : string = "";
  audioTocando: HTMLAudioElement | null = null;
  carregando: boolean = true;
  colSize = "6";

  constructor(private http: HttpClient, private platform: Platform, private router: Router) {
    this.checaOrientacao();

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url == "/home" && this.logado && this.categoriaEscolhida){
        this.volta();
      }
      else if(this.router.url == "/home"){
        App.exitApp();
      }
    });

    this.logado = localStorage.getItem("logado") == "true";
  }

  ngOnInit() {
    const apiUrl = 'https://api-pecs.vercel.app/cards.json';

    this.http.get<any>(apiUrl).subscribe(
      (next) => {
        this.cards = next;
        this.esperaCarregamento();
      },
      (error) => {
        console.error('Erro ao chamar a API', error);
        this.carregando = false;
      }
    );
  }

  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSize = window.innerWidth > window.innerHeight ? '3' : '6';
  }

  esperaCarregamento(){
    let imagens = this.cards.map(card => new Promise(resolve =>{
      let imagem = new Image();
      imagem.src = card.imagem_url;
      imagem.onload = () => resolve(true);
    }));

    Promise.all(imagens).then(() =>{
      this.carregando = false;
    })
  }
 
  solicitaCadastro(){
    this.cadastrado = false;
  }

  finalizaCadastro(){
    this.cadastrado = true;
  }

  voltaLogin(){
    this.cadastrado = true;
  }

  login(){
    if (this.usuario === "teste" && this.senha === "teste"){
      this.logado = true;
      localStorage.setItem("logado", this.logado.toString());
    }
    else{
      alert("Usuário ou senha inválidos");
    }
  }

  categorias = [
    { nome: 'Ajuda', icone: 'alert', cor: 'light' },
    { nome: 'Ações', icone: 'flash', cor: 'warning' },
    { nome: 'Alimentação', icone: 'fast-food', cor: 'danger' },
    { nome: 'Eventos', icone: 'balloon', cor: 'success' },
    { nome: 'Lugares', icone: 'business', cor: 'tertiary' },
    { nome: 'Necessidades', icone: 'hand-left', cor: 'primary' },
    { nome: 'Objetos', icone: 'dice', cor: 'warning' },
    { nome: 'Sentimentos', icone: 'happy', cor: 'danger' },
    { nome: 'Higiene', icone: 'medkit', cor: 'secondary' },
    { nome: 'Partes do Corpo', icone: 'body', cor: 'tertiary' },
    { nome: 'Respostas Curtas', icone: 'thumbs-up', cor: 'success' },
    { nome: 'Pessoas', icone: 'people', cor: 'dark' }
  ];
  
  selecionaCategoria(categoria: any) {
    this.carregando = true;
    this.categoriaEscolhida = true;
    this.categoria = categoria.nome;

    this.esperaCarregamento();
  }

  get cardsFiltrados() {
    return this.cards
    .filter(c => c.categoria === this.categoria)
    .sort((a,b) => a.titulo.localeCompare(b.titulo));
  }
  
  volta(){
    this.categoriaEscolhida = false;
    this.categoria = "";
  }

  escolheCard(url: string){
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
