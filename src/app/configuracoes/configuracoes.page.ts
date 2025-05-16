import { Component, OnInit, HostListener } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false
})
export class ConfiguracoesPage implements OnInit {

  // Flag para o modo escuro, controla se a classe "dark" deve ser aplicada
  modoEscuro: boolean = false;
  // Tamanho das colunas para a imagem do perfil, ajusta de acordo com a orientação da tela
  colSizeEditProfileImg = '12';
  // Tamanho das colunas para as informações da conta
  colSizeEditProfileInfo = '12';
  // Tamanho das colunas para os ícones de perfil
  colSizeIcons = '4';
  
  // Propriedades dos dados da conta (informações que serão preenchidas e alteradas via formulário)
  nomeTutor: string = "";
  nomeCrianca: string = "";
  email: string = "";
  usuario: string = "";
  // Propriedades para alteração de senha (nova senha e confirmação)
  novaSenha: string = "";
  confirmarSenha: string = "";

  // ID do usuário, utilizado para identificar o registro no banco durante atualizações ou exclusões
  id: number = 0; 

  // Propriedade referente à foto de perfil, usada para exibição (não será alterada nesta operação)
  fotoDePerfil: string = "padrao";
  // Armazena o ícone selecionado temporariamente para alteração visual do perfil
  iconeSelecionado: string = this.fotoDePerfil;
  
  // Objeto "perfil" que guarda o caminho (URL) da imagem do perfil; usado na interface (imagem exibida)
  perfil: { foto: string } = {
    foto: `assets/perfil-icons/${this.fotoDePerfil}.png`
  };

  // Array de objetos com os ícones disponíveis para o perfil (nome e URL da imagem)
  icones = [
    { nome: 'autismo', src: 'assets/perfil-icons/autismo.png' },
    { nome: 'girassol', src: 'assets/perfil-icons/girassol.png' },
    { nome: 'coracao', src: 'assets/perfil-icons/coracao.png' },
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
    { nome: 'panda', src: 'assets/perfil-icons/panda.png'},
    { nome: 'dragao-verde', src: 'assets/perfil-icons/dragao-verde.png'},
    { nome: 'dragao-vermelho', src: 'assets/perfil-icons/dragao-vermelho.png'},
    { nome: 'astronauta', src: 'assets/perfil-icons/astronauta.png'},
    { nome: 'robo', src: 'assets/perfil-icons/robo.png'},
    { nome: 'samurai', src: 'assets/perfil-icons/samurai.png'},
    { nome: 'detetive', src: 'assets/perfil-icons/detetive.png'},
    { nome: 'princesa-1', src: 'assets/perfil-icons/princesa-1.png'},
    { nome: 'princesa-2', src: 'assets/perfil-icons/princesa-2.png'},
    { nome: 'escudeiro', src: 'assets/perfil-icons/escudeiro.png'},
    { nome: 'elfo-arqueiro', src: 'assets/perfil-icons/elfo-arqueiro.png'},
    { nome: 'cavaleira', src: 'assets/perfil-icons/cavaleira.png'},
    { nome: 'maga', src: 'assets/perfil-icons/maga.png'},
    { nome: 'mago', src: 'assets/perfil-icons/mago.png'},
    { nome: 'fada', src: 'assets/perfil-icons/fada.png'},
  ];

  // CONSTRUTOR
  // O construtor injeta o serviço do usuário e chama funções para configurar a interface
  constructor(private usuarioService: UsuarioService, private alertController: AlertController) { 
    // Ajusta a interface com base na orientação da tela
    this.checaOrientacao();
    // Recupera o valor do modo escuro armazenado em localStorage
    this.modoEscuro = localStorage.getItem("modoEscuro") == "true";
    // Aplica as classes necessárias para o modo escuro na aplicação
    this.aplicaModoEscuro();
  }

  // MÉTODO NGONINIT
  // É executado assim que o componente é inicializado
  ngOnInit() {
    // Verifica se há um ícone salvo para o perfil e atualiza o objeto "perfil"
    const iconeSalvo = localStorage.getItem('fotoDePerfil');
    if (iconeSalvo) {
      this.fotoDePerfil = iconeSalvo;
      this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
    }
    
    // Carrega os demais dados do usuário armazenados no localStorage para pré-preencher os inputs
    this.nomeTutor = localStorage.getItem('nomeTutor') || "";
    this.nomeCrianca = localStorage.getItem('nomeCrianca') || "";
    this.email = localStorage.getItem('email') || "";
    this.usuario = localStorage.getItem('usuario') || "";
    // Converte para número, caso contrário o valor é uma string
    this.id = Number(localStorage.getItem('id')) || 0;
  }

  // HOST LISTENER para redimensionamento da janela
  // Atualiza os tamanhos das colunas conforme o tamanho da janela (orientação da tela)
  @HostListener('window:resize', [])
  checaOrientacao() {
    this.colSizeEditProfileImg = window.innerWidth > window.innerHeight ? '5' : '12';
    this.colSizeEditProfileInfo = window.innerWidth > window.innerHeight ? '7' : '12';
    this.colSizeIcons = window.innerWidth > window.innerHeight ? '3' : '4';
  }
  
  // Função para alternar o modo escuro utilizando um toggle na interface
  toggleModoEscuro(event: any){
    // Atualiza a propriedade modoEscuro com base no evento disparado
    this.modoEscuro = event.detail.checked;
    // Salva a preferência do modo escuro no localStorage (como string)
    localStorage.setItem("modoEscuro", this.modoEscuro.toString());
    // Aplica a classe "dark" se o modo estiver ativo
    this.aplicaModoEscuro();
  }
  
  // Aplica ou remove a classe "dark" no documento, conforme o valor de modoEscuro
  aplicaModoEscuro(){
    const aplicativo = document.documentElement;
    // Se modoEscuro for true, adiciona a classe "dark", senão, remove-a
    this.modoEscuro ? aplicativo.classList.add("dark") : aplicativo.classList.remove("dark");
  }

  // Método para atualizar os dados da conta do usuário
async atualizaCadastro() {
  // Validação para senha
  if ((this.novaSenha || this.confirmarSenha) && (this.novaSenha != this.confirmarSenha)) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: 'As senhas não coincidem.',
      cssClass: 'alerta-alteracao',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Prepara os dados
  let dadosAtualizados: any = {
    id: this.id,
    nome_tutor: this.nomeTutor,
    nome_crianca: this.nomeCrianca,
    email: this.email,
    usuario: this.usuario
  };

  if (this.novaSenha) {
    dadosAtualizados.senha = this.novaSenha;
  }

  // Faz a requisição
  this.usuarioService.atualizarUsuario(dadosAtualizados).subscribe(
    async (res: any) => {
      if (res.status === "sucesso") {
        const successAlert = await this.alertController.create({
          header: 'Sucesso!',
          message: 'Dados atualizados com sucesso.',
          cssClass: 'alerta-alteracao',
          buttons: ['OK']
        });
        await successAlert.present();
      } else {
        const errorAlert = await this.alertController.create({
          header: 'Erro',
          message: 'Erro ao atualizar: ' + res.message,
          cssClass: 'alerta-alteracao',
          buttons: ['OK']
        });
        await errorAlert.present();
      }
    },
    async (err: any) => {
      const connectionAlert = await this.alertController.create({
        header: 'Erro de conexão',
        message: 'Erro ao conectar com o servidor.',
        cssClass: 'alerta-alteracao',
        buttons: ['OK']
      });
      await connectionAlert.present();
      console.error("Erro na requisição:", err);
    }
  );
}

  // Função para deletar a conta do usuário
async deletaConta() {
  const alert = await this.alertController.create({
    header: 'Deseja excluir sua conta?',
    message: 'Você realmente deseja excluir a sua conta? Todos os seus dados do CASA serão apagados. Esta ação não pode ser desfeita.',
    cssClass: 'alerta',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'botao-cancelar',
        handler: () => {
          console.log('Exclusão cancelada');
        }
      },
      {
        text: 'Sim, deletar',
        cssClass: 'botao-confirmar',
        handler: () => {
          this.usuarioService.deletarUsuario(this.id).subscribe(
            (res: any) => {
              if (res.status === "sucesso") {
                this.alertController.create({
                  header: 'Conta deletada',
                  message: 'Sua conta foi excluída com sucesso.',
                  buttons: ['OK']
                }).then(alert => alert.present());
                
                localStorage.clear();
                // this.router.navigate(['/login']); // Opcional
              } else {
                this.alertController.create({
                  header: 'Erro',
                  message: 'Erro ao deletar a conta: ' + res.message,
                  buttons: ['OK']
                }).then(alert => alert.present());
              }
            },
            (err: any) => {
              this.alertController.create({
                header: 'Erro de conexão',
                message: 'Erro ao conectar com o servidor.',
                buttons: ['OK']
              }).then(alert => alert.present());

              console.error("Erro na requisição:", err);
            }
          );
        }
      }
    ]
  });

  await alert.present();
}

  // MÉTODO PARA TRATAR ÍCONES (não alterados, apenas comentários adicionais)
  
  // Atualiza a visualização do ícone selecionado, alterando a imagem exibida
  visualizaIcone(nome: string) {
    this.iconeSelecionado = nome;
    this.perfil.foto = `assets/perfil-icons/${this.iconeSelecionado}.png`;
  }

  // Atualiza o ícone do perfil, salvando a escolha no localStorage e recarregando a página para refletir a mudança
  mudaIcone() {
    this.fotoDePerfil = this.iconeSelecionado;
    localStorage.setItem('fotoDePerfil', this.fotoDePerfil);
    location.reload();
  }

  // Remove o ícone personalizado e retorna ao ícone padrão (removendo a informação do localStorage e recarregando)
  removeIcone(){
    this.fotoDePerfil = 'padrao';
    this.perfil.foto = `assets/perfil-icons/${this.fotoDePerfil}.png`;
    localStorage.removeItem('fotoDePerfil');
    location.reload();
  }
}

