import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.logado = localStorage.getItem("logado") == "true";
  }

  ngOnInit() {
    const apiUrl = 'https://api-pecs.vercel.app/cards.json';

    this.http.get<any>(apiUrl).subscribe(
      (next) => {
        this.cards = next;
      },
      (error) => {
        console.error('Erro ao chamar a API', error);
      }
    );
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
    this.categoriaEscolhida = true;
    this.categoria = categoria.nome;
  }

  get cardsFiltrados() {
    return this.cards.filter(c => c.categoria === this.categoria);
  }
  
  volta(){
    this.categoriaEscolhida = false;
    this.categoria = "";
  }

  escolheCard(url: string){
    const audio = new Audio(url);
    audio.play();
  }
}
