import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: false
})
export class SobrePage implements OnInit {

  logado: boolean = false;
  colSizeAutores = '6';

  autores = [
    { nome: "Douglas", funcao: "FRONT-END", foto: "assets/autores/douglas.png", local: "EXTENSÃO"},
    { nome: "Jhonatan", funcao: "BACK-END", foto: "assets/autores/jhonatan.png", local: "EXTENSÃO"},
    { nome: "Daiane", funcao: "DOCUMENTAÇÃO", foto: "assets/autores/daiane.png", local: "EXTENSÃO"},
    { nome: "Gustavo", funcao: "EDITOR", foto: "assets/autores/gustavo.png", local: "EXTENSÃO"},
    { nome: "Raphael", funcao: "DESENVOLVEDOR", foto: "assets/autores/raphael.png", local: "SEDE"},
    { nome: "Yasmin", funcao: "PESQUISADORA", foto: "assets/autores/yasmin.png", local: "SEDE"},
    { nome: "Priscila", funcao: "PESQUISADORA", foto: "assets/autores/priscila.png", local: "SEDE"},
    { nome: "Zeus", funcao: "DESENVOLVEDOR", foto: "assets/autores/zeus.png", local: "SEDE"}
  ]

  constructor() {
    this.logado = localStorage.getItem("logado") === "true";
    this.checaOrientacao();
   }

  ngOnInit() {
  }

  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSizeAutores = window.innerWidth > window.innerHeight ? '3' : '6';
  }

}
