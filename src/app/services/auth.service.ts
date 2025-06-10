import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioId: number | null = null;
  private logadoSubject = new BehaviorSubject<boolean>(false);
  logado$ = this.logadoSubject.asObservable();

  constructor() {
    const id = localStorage.getItem("id");
    const logado = localStorage.getItem("logado") === "true";

    if (id && logado) {
      this.usuarioId = parseInt(id);
      this.logadoSubject.next(true);
    } else {
      this.usuarioId = null;
      this.logadoSubject.next(false);
    }
  }

  setId(id: number): void {
    this.usuarioId = id;
    localStorage.setItem("id", id.toString());
    localStorage.setItem("logado", "true");
    this.logadoSubject.next(true);
  }

  getId(): number | null {
    return this.usuarioId;
  }

  isLogado(): boolean {
    return this.usuarioId !== null;
  }

  limpar(): void {
    this.usuarioId = null;
    localStorage.removeItem("id");
    localStorage.setItem("logado", "false");
    this.logadoSubject.next(false);
  }

  atualizarLoginStatus(): void {
    const id = localStorage.getItem("id");
    const logado = localStorage.getItem("logado") === "true";

    if (id && logado) {
      this.usuarioId = parseInt(id);
      this.logadoSubject.next(true);
    } else {
      this.usuarioId = null;
      this.logadoSubject.next(false);
    }
  }

}
