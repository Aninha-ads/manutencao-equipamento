import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { Categoria } from '../../models/categoria.model';
import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { FuncionarioTela, SolicitacaoTela } from '../models/dados-tela.model';
import { environment } from '../../../environments/environment';

export interface DadosTelas {
  clientes: Cliente[]; funcionarios: FuncionarioTela[];
  categorias: Categoria[]; solicitacoes: SolicitacaoTela[];
}
@Injectable({ providedIn: 'root' })
export class DadosService {
  private http = inject(HttpClient);
  private readonly api = environment.apiUrl;
  private dados: DadosTelas = { clientes: [], funcionarios: [], categorias: [], solicitacoes: [] };
  // Carrega antes da primeira tela. Não há fallback para mocks ou armazenamento local.
  async carregar(): Promise<void> {
    this.dados = await firstValueFrom(this.http.get<DadosTelas>(`${this.api}/dados`));
  }
  listarClientes() { return structuredClone(this.dados.clientes); }
  listarFuncionarios() { return structuredClone(this.dados.funcionarios); }
  listarCategorias() { return structuredClone(this.dados.categorias); }
  listarSolicitacoes() { return structuredClone(this.dados.solicitacoes); }
  buscarSolicitacao(valor: string | null) {
    return valor && /^\d+$/.test(valor) ? this.listarSolicitacoes().find(s => s.id === Number(valor)) : undefined;
  }
  async salvarFuncionario(f: FuncionarioTela, novo = false) {
    const salvo = await firstValueFrom(novo
      ? this.http.post<FuncionarioTela>(`${this.api}/funcionarios`, f)
      : this.http.put<FuncionarioTela>(`${this.api}/funcionarios/${f.id}`, f));
    await this.carregar();
    return salvo;
  }
  async removerFuncionario(id: number) {
    await firstValueFrom(this.http.delete(`${this.api}/funcionarios/${id}`));
    await this.carregar();
  }
  async salvarCliente(c: Cliente, novo = false) {
    const salvo = await firstValueFrom(novo
      ? this.http.post<Cliente>(`${this.api}/clientes`, c)
      : this.http.put<Cliente>(`${this.api}/clientes/${c.id}`, c));
    await this.carregar();
    return salvo;
  }
  async salvarCategoria(c: Categoria) {
    const salvo = await firstValueFrom(this.http.post<Categoria>(`${this.api}/categorias`, { ...c, id: c.id || null }));
    await this.carregar();
    return salvo;
  }
  async excluirCategoria(id: number) {
    await firstValueFrom(this.http.delete(`${this.api}/categorias/${id}`));
    await this.carregar();
  }
  async criarSolicitacao(dados: { clienteId: number; categoriaId: number; equipamento: string; descricao: string }) {
    const salvo = await firstValueFrom(this.http.post<{ id: number }>(`${this.api}/solicitacoes`, dados));
    await this.carregar();
    return salvo;
  }
  async mudarEstado(id: number, estado: EstadoSolicitacao, autorId?: number) {
    await firstValueFrom(this.http.patch(`${this.api}/solicitacoes/${id}/estado`, { estado, autorId }));
    await this.carregar();
  }
}
