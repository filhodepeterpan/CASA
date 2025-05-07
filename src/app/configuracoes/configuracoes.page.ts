import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false
})
export class ConfiguracoesPage implements OnInit {

  modoEscuro : boolean = false;
  colSizeEditProfile = '12';

  constructor() { 
    this.checaOrientacao();
    
    this.modoEscuro = localStorage.getItem("modoEscuro") == "true";
    this.aplicaModoEscuro();
  }

  ngOnInit() {
  }

    @HostListener('window:resize', [])
    checaOrientacao() {
      this.colSizeEditProfile = window.innerWidth > window.innerHeight ? '6' : '12';
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

}

