import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private httpClient = inject(HttpClient);

  BASE_URL = 'http://localhost:3000/funcionarios';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  listarTodos(): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.BASE_URL, this.httpOptions);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(this.BASE_URL + '/' + id, this.httpOptions);
  }

  inserir(cliente: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(this.BASE_URL, JSON.stringify(cliente), this.httpOptions);
  }

  alterar(cliente: Funcionario): Observable<Funcionario> {
    return this.httpClient.put<Funcionario>(this.BASE_URL + '/' + cliente.id, JSON.stringify(cliente), this.httpOptions);
  }

  // extra (não está nos slides): login e checagem de e-mail único
  buscarPorEmail(email: string): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.BASE_URL + '?email=' + email, this.httpOptions);
  }
}
