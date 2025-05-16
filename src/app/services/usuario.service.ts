import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost/config/api.php';

  constructor(private http: HttpClient) {}

  cadastrar(dados: any) {
    return this.http.post(this.apiUrl, { ...dados, cadastro: true });
  }

  login(usuario: string, senha: string) {
    return this.http.post(this.apiUrl, { usuario, senha, login: true });
  }

  atualizarUsuario(dados: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl, dados, { headers });
  }
  
  deletarUsuario(id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(this.apiUrl, { headers, body: { id } });
  }
}
