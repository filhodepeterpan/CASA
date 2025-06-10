import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // URL da API utilizada para as operações de usuário (cadastro, login, atualização e deleção)
  private apiUrl = (environment as any).linkAPI;

  // Injetamos o HttpClient para permitir que possamos fazer requisições HTTP
  constructor(private http: HttpClient) { }

  /**
   * Cadastra um novo usuário.
   * Recebe um objeto "dados" contendo as informações do usuário e adiciona a flag "cadastro: true"
   * para indicar que é uma requisição de cadastro. Em seguida, envia os dados via método POST para a API.
   *
   * @param dados - Objeto com as informações do usuário a ser cadastrado.
   * @returns Um Observable com a resposta da API.
   */
  cadastrar(dados: any) {
    return this.http.post(this.apiUrl, { ...dados, cadastro: true });
  }

  /**
   * Realiza o login do usuário.
   * Recebe os parâmetros "usuario" e "senha", adiciona a flag "login: true"
   * para indicar que esta é uma requisição de autenticação e envia via POST para a API.
   *
   * @param usuario - Nome de usuário informado.
   * @param senha - Senha informada.
   * @returns Um Observable com a resposta da API.
   */
  login(usuario: string, senha: string) {
    return this.http.post(this.apiUrl, { usuario, senha, login: true });
  }

  /**
   * Atualiza os dados do usuário.
   * Envia uma requisição PUT contendo os novos dados do usuário.
   * Define o cabeçalho Content-Type como "application/json" para garantir que os dados sejam interpretados corretamente.
   *
   * @param dados - Objeto contendo os dados atualizados do usuário.
   * @returns Um Observable com a resposta da API.
   */
  atualizarUsuario(dados: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl, dados, { headers });
  }

  /**
   * Deleta um usuário.
   * Envia uma requisição DELETE contendo o ID do usuário a ser removido.
   * O ID do usuário é enviado no corpo da requisição, junto com o cabeçalho adequadamente configurado.
   *
   * @param id - Número que identifica o usuário a ser deletado.
   * @returns Um Observable com a resposta da API.
   */
  deletarUsuario(id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(this.apiUrl, { headers, body: { id } });
  }

  verificarSenha(id: number, senha: string) {
    return this.http.post<{ senhaCorreta: boolean }>(this.apiUrl, {
      verificarSenha: true,
      id,
      senha
    });
  }

  mostrarTodosOsUsuarios(){
    
  }

}
