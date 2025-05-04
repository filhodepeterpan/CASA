import { Component, OnInit } from '@angular/core';
import emailjs from '@emailjs/browser'; 

@Component({
  selector: 'app-contato',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss'],
  standalone: false
})
export class ContatoPage implements OnInit {
  nomeTutor: string = "Douglas";
  email: string = "douglassoares.cinema@gmail.com";
  usuario: string = "doug2609";
  casaID: string = "AZ126";
  assunto: string = "";
  mensagem: string = "";
  modalSucesso? : boolean;
  respostaTitulo: string = "";
  respostaDesc: string = "";

  constructor() { }

  ngOnInit() {
  }

  enviaMensagem(){
    const serviceID = 'service_casa';
    const templateID = 'template_8jnh90q';
    const userID = 'jz_fZnjS6I5Hw7E8t'; 

    const templateParams = {
      nomeTutor: this.nomeTutor,
      email: this.email,
      mensagem: this.mensagem,
      casaID: this.casaID,
      usuario: this.usuario,
      assunto: this.assunto
    };

    emailjs.send(serviceID, templateID, templateParams, userID)
      .then((response) => {

        if(this.assunto!="" && this.mensagem!=""){
          console.log('Mensagem enviada com sucesso!', response);

          this.modalSucesso = true;
          this.respostaTitulo = "Mensagem enviada";
          this.respostaDesc = "Sua mensagem foi enviada com sucesso! Aguarde para que nossa equipe responda no prazo de 3 dias úteis.";
        }
        else{
          this.modalSucesso = true;
          this.respostaTitulo = "Erro";
          this.respostaDesc = "Por favor, preencha todos os campos para enviar sua mensagem.";
        }
      })
      .catch((error) => {
        console.error('Erro ao enviar a mensagem', error);
        this.modalSucesso = true;
        this.respostaTitulo = "Algo deu errado";
        this.respostaDesc = "Aparentemente tivemos um erro com o servidor. Tente novamente mais tarde ou envie seu e-mail diretamente para casaapp.contato@gmail.com";
      });

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
