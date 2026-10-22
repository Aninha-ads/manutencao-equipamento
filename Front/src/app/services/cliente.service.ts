import { inject, Injectable } from '@angular/core';
import { defer, of, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { DadosService } from '../core/services/dados.service';
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private dados = inject(DadosService);
  private listar() { return this.dados.listarClientes(); }

  listarTodos() { return defer(() => of(this.listar())); }
  buscarPorId(id: number) { return defer(() => {
    const registro = this.listar().find(c => c.id === id);
    return registro ? of(registro) : throwError(() => new Error('Registro não encontrado'));
  }); }
  private salvar(dados: Cliente, novo: boolean) { return this.dados.salvarCliente(dados, novo); }
  inserir(dados: Cliente) { return defer(() => this.salvar(dados, true)); }
  alterar(dados: Cliente) { return defer(() => this.salvar(dados, false)); }
  buscarPorEmail(email: string) { return defer(() => of(this.listar().filter(c => c.email.toLowerCase() === email.trim().toLowerCase()))); }
}
