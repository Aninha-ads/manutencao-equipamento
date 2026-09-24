import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
}) 
export class ClienteService {
  private httpClient = inject(HttpClient);
  BASE_URL = 'http://localhost:3000/clientes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  listarTodos(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.BASE_URL, this.httpOptions);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.BASE_URL + '/' + id, this.httpOptions);
  }

  inserir(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.BASE_URL, JSON.stringify(cliente), this.httpOptions);
  }

  alterar(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(this.BASE_URL + '/' + cliente.id, JSON.stringify(cliente), this.httpOptions);
  }

  // extra (não está nos slides): login e checagem de e-mail único
  buscarPorEmail(email: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.BASE_URL + '?email=' + email, this.httpOptions);
  }
}

