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
  }

  icones = [
    { nome: 'menina-branca', src: 'assets/perfil-icons/menina-branca.png'},
    { nome: 'menino-branco', src: 'assets/perfil-icons/menino-branco.png'},
    { nome: 'menina-negra', src: 'assets/perfil-icons/menina-negra.png' },
    { nome: 'menino-negro', src: 'assets/perfil-icons/menino-negro.png' },
    { nome: 'menina-negra-cabelo-liso', src: 'assets/perfil-icons/menina-negra-cabelo-liso.png' },
    { nome: 'menino-indigena', src: 'assets/perfil-icons/menino-indigena.png' },
    { nome: 'menina-loira', src: 'assets/perfil-icons/menina-loira.png' },
    { nome: 'menino-loiro', src: 'assets/perfil-icons/menino-loiro.png' }
    // Adicionar futuramente: crianças asiáticas/japonesas, com síndrome de down, deficientes visuais entre outras inclusões.
  ];

}


