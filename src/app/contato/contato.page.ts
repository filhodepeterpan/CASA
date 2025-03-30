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
        console.log('Mensagem enviada com sucesso!', response);
        alert('Mensagem enviada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao enviar a mensagem', error);
        alert('Erro ao enviar a mensagem. Tente novamente.');
      });
  }

}
