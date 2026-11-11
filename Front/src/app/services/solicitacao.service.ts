import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private apiUrl = 'http://localhost:8080/api/solicitacoes';
  private http = inject(HttpClient);

  listar(clienteId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (clienteId) {
      params = params.set('clienteId', clienteId.toString());
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  buscarPorPeriodo(inicio: string, fim: string): Observable<any[]> {
    const params = new HttpParams().set('inicio', inicio).set('fim', fim);
    return this.http.get<any[]>(`${this.apiUrl}/periodo`, { params });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  pagar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/pagar`, {});
  }

  finalizar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/finalizar`, {});
  }
}