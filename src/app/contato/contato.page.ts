import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import emailjs from '@emailjs/browser'; 


@Component({
  selector: 'app-contato',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss'],
  standalone: false
})
export class ContatoPage implements OnInit {
  assunto: string = "";
  mensagem: string = "";
  logado: boolean = false;

  constructor(private alertController: AlertController) {
    this.logado = localStorage.getItem("logado") === "true";
   }

  ngOnInit() {
  }

async enviaMensagem(form: NgForm) {
  if (form.invalid) return;

  const confirmAlert = await this.alertController.create({
    header: 'Confirmar envio',
    message: 'Você tem certeza que deseja enviar esta mensagem?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      },
      {
        text: 'Enviar',
        cssClass: 'alert-button-send',
        handler: () => this.enviaEmail() // chama a função de envio real
      }
    ]
  });

  await confirmAlert.present();
}

async enviaEmail() {
  const serviceID = environment.emailJS.serviceID;
  const templateID = environment.emailJS.templateID;
  const userID = environment.emailJS.userID;

  const nomeTutor = localStorage.getItem("nomeTutor") || "";
  const email = localStorage.getItem("email") || "";
  const casaID = localStorage.getItem("casaID") || "";
  const usuario = localStorage.getItem("usuario") || "";

  const templateParams = {
    nomeTutor: nomeTutor,
    email: email,
    casaID: casaID,
    usuario: usuario,
    assunto: this.assunto,
    mensagem: this.mensagem
  };

  try {
    await emailjs.send(serviceID, templateID, templateParams, userID);

    const sucesso = await this.alertController.create({
      header: 'Mensagem enviada',
      message: 'Sua mensagem foi enviada com sucesso! Aguarde resposta em até 3 dias úteis.',
      buttons: ['OK'],
      cssClass: 'alert-sucesso'
    });

    await sucesso.present();
    this.limpaFormulario();

  } catch (error) {
    console.error('Erro ao enviar a mensagem', error);

    const erro = await this.alertController.create({
      header: 'Erro no envio',
      message: 'Tivemos um problema ao enviar sua mensagem. Tente novamente mais tarde ou envie um e-mail diretamente para <strong>casaapp.contato@gmail.com</strong>.',
      buttons: ['OK'],
      cssClass: 'alert-erro'
    });

    await erro.present();
  }
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
