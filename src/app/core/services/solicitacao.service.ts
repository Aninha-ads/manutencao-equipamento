import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Solicitacao,
  EstadoSolicitacao,
  HistoricoSolicitacao
} from '../models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private http = inject(HttpClient);
  private readonly base = '/api/solicitacoes';

  listarPorCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.base}/cliente/${clienteId}`);
  }

  listarAbertas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.base}/abertas`);
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.base}/${id}`);
  }

  historico(id: number): Observable<HistoricoSolicitacao[]> {
    return this.http.get<HistoricoSolicitacao[]>(
      `${this.base}/${id}/historico`
    );
  }

  criar(dados: Partial<Solicitacao>): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.base, dados);
  }

  mudarEstado(
    id: number,
    estado: EstadoSolicitacao,
    payload: Record<string, unknown> = {}
  ): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/estado`, {
      estado,
      ...payload
    });
  }
}