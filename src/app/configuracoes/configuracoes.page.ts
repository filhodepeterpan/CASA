import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false
})
export class ConfiguracoesPage implements OnInit {

  modoEscuro : boolean = false;
  colSizeEditProfileImg = '12';
  colSizeEditProfileInfo = '12';
  colSizeIcons = '4';
  fotoDePerfil: string = "padrao";
  iconeSelecionado: string = this.fotoDePerfil;

  constructor() { 
    this.checaOrientacao();
    
    this.modoEscuro = localStorage.getItem("modoEscuro") == "true";
    this.aplicaModoEscuro();
  }

  ngOnInit() {
    const iconeSalvo = localStorage.getItem('fotoDePerfil');
    if (iconeSalvo) {
      this.fotoDePerfil = iconeSalvo;
      this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
    }
  }

  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSizeEditProfileImg = window.innerWidth > window.innerHeight ? '5' : '12';
    this.colSizeEditProfileInfo = window.innerWidth > window.innerHeight ? '7' : '12';
    this.colSizeIcons = window.innerWidth > window.innerHeight ? '3' : '4';
  }

  toggleModoEscuro(event: any){
    this.modoEscuro = event.detail.checked;
    localStorage.setItem("modoEscuro", this.modoEscuro.toString());
    
    this.aplicaModoEscuro();
  }

  aplicaModoEscuro(){
    const aplicativo = document.documentElement;

    this.modoEscuro == true? aplicativo.classList.add("dark") : aplicativo.classList.remove("dark");
  }

  atualizaCadastro(){

    this.limpaFormulario();
  }

  limpaFormulario(){
    const inputs = document.querySelectorAll("input");
    const textAreas = document.querySelectorAll("textarea");

    inputs.forEach(input =>{
      (input as HTMLInputElement).value = "";
    });

    textAreas.forEach(textArea =>{
      (textArea as HTMLTextAreaElement).value = "";
    });
  }
  
  perfil: {foto: string} = {
    foto: `assets/perfil-icons/${this.fotoDePerfil}.png`
  };

  visualizaIcone(nome: string) {
    this.iconeSelecionado = nome;
    this.perfil.foto = `assets/perfil-icons/${this.iconeSelecionado}.png`;
  }
  
  mudaIcone() {
    this.fotoDePerfil = this.iconeSelecionado;
    localStorage.setItem('fotoDePerfil', this.fotoDePerfil);

    location.reload();
  }

  removeIcone(){
    this.fotoDePerfil = 'padrao';
    this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
    localStorage.removeItem('fotoDePerfil');

    location.reload();
  }

  icones = [
    { nome: 'menina-branca', src: 'assets/perfil-icons/menina-branca.png' },
    { nome: 'menino-branco', src: 'assets/perfil-icons/menino-branco.png' },
    { nome: 'menina-negra', src: 'assets/perfil-icons/menina-negra.png' },
    { nome: 'menino-negro', src: 'assets/perfil-icons/menino-negro.png' },
    { nome: 'menina-negra-cabelo-liso', src: 'assets/perfil-icons/menina-negra-cabelo-liso.png' },
    { nome: 'menino-indigena', src: 'assets/perfil-icons/menino-indigena.png' },
    { nome: 'menina-loira', src: 'assets/perfil-icons/menina-loira.png' },
    { nome: 'menino-loiro', src: 'assets/perfil-icons/menino-loiro.png' },
    { nome: 'menina-asiatica', src: 'assets/perfil-icons/menina-asiatica.png' },
    { nome: 'menino-asiatico', src: 'assets/perfil-icons/menino-asiatico.png' },
    { nome: 'menina-sd', src: 'assets/perfil-icons/menina-sd.png' },
    { nome: 'menino-sd', src: 'assets/perfil-icons/menino-sd.png' },
    { nome: 'menina-negra-dreads', src: 'assets/perfil-icons/menina-negra-dreads.png' },
    { nome: 'menino-pardo-cabelo-cacheado', src: 'assets/perfil-icons/menino-pardo-cabelo-cacheado.png' },
    { nome: 'menina-branca-2', src: 'assets/perfil-icons/menina-branca-2.png' },
    { nome: 'menino-branco-2', src: 'assets/perfil-icons/menino-branco-2.png' },
    { nome: 'menina-oculos', src: 'assets/perfil-icons/menina-oculos.png' },
    { nome: 'menino-oculos', src: 'assets/perfil-icons/menino-oculos.png' },
    { nome: 'menina-negra-2', src: 'assets/perfil-icons/menina-negra-2.png' },
    { nome: 'menino-negro-2', src: 'assets/perfil-icons/menino-negro-2.png' },
    { nome: 'crianca-sem-cabelo', src: 'assets/perfil-icons/crianca-sem-cabelo.png' },
    { nome: 'dinossauro', src: 'assets/perfil-icons/dinossauro.png'},
    { nome: 'gata', src: 'assets/perfil-icons/gata.png'},
    { nome: 'cachorro', src: 'assets/perfil-icons/cachorro.png'},
    { nome: 'pinguim', src: 'assets/perfil-icons/pinguim.png'},
    { nome: 'astronauta', src: 'assets/perfil-icons/astronauta.png'},
    { nome: 'robo', src: 'assets/perfil-icons/robo.png'},
    { nome: 'samurai', src: 'assets/perfil-icons/samurai.png'},
  ];

}


