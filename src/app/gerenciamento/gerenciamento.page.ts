import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-gerenciamento',
  templateUrl: './gerenciamento.page.html',
  styleUrls: ['./gerenciamento.page.scss'],
  standalone: false
})
export class GerenciamentoPage implements OnInit {
  logado: boolean = false;
  sessaoEscolhida: boolean = false;
  colSizeSessao = '6';
  colSizeCardsInfo = '12';
  colSizeCardsInfoSessao = '6';
  sessao?: string;
  cards: any = [];
  usuarioLogado: string = "";
  acessoDeAdministrador: boolean = false;
  modoEscuro: boolean = false;
  corChip: string = "dark";

  constructor(private http: HttpClient) {
    this.logado = localStorage.getItem("logado") === "true";
    this.checaOrientacao();
    this.checaModoEscuro();

    this.usuarioLogado = "@" + localStorage.getItem("usuario") || "Desconectado";

    if (this.usuarioLogado == "@casa") {
      this.acessoDeAdministrador = true;
    }
    
    console.log("Administrador?: " + (this.acessoDeAdministrador? "SIM": "NÃO"));
  }

  ngOnInit() {
    this.checaOrientacao();
    this.checaModoEscuro();

    const apiUrl = 'https://api-pecs.vercel.app/cards.json';

    this.http.get<any>(apiUrl).subscribe(
      (next) => {
        this.cards = next.sort((a: any, b: any) => {
          return a.titulo.localeCompare(b.titulo);
        });
      },
      (error) => {
        console.error('Erro ao chamar a API', error);
      }
    );
  }


  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSizeSessao = window.innerWidth > window.innerHeight ? '3' : '6';
    this.colSizeCardsInfo = window.innerWidth > window.innerHeight ? '6' : '12';
    this.colSizeCardsInfoSessao = window.innerWidth > window.innerHeight ? '6' : '12';
  }
  
  checaModoEscuro(){
    this.modoEscuro = localStorage.getItem("modoEscuro") === "true";

    this.corChip = this.modoEscuro == true? "light" : "dark";
  }

  volta() {
    this.sessaoEscolhida = false;
  }

  escolheSessao(sessao: string) {
    this.sessao = sessao;
    this.sessaoEscolhida = true;
  }

  copiaTexto(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log('Texto copiado:', texto);
    });
  }


}
