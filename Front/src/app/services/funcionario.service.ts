import { inject, Injectable } from '@angular/core';
import { defer, of, throwError } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';
import { DadosService } from '../core/services/dados.service';
import { FuncionarioTela } from '../core/models/dados-tela.model';
@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private dados = inject(DadosService);

  private converter(f: FuncionarioTela): Funcionario {
    return { id: f.id, nome: f.nome, email: f.email, dataNascimento: f.nascimento, ativo: true };
  }
  private listar() { return this.dados.listarFuncionarios().map(f => this.converter(f)); }
  private paraTela(f: Funcionario): FuncionarioTela {
    return { id: f.id ?? 0, nome: f.nome, email: f.email, nascimento: f.dataNascimento };
  }

  listarTodos() { return defer(() => of(this.listar())); }
  buscarPorId(id: number) { return defer(() => {
    const registro = this.listar().find(c => c.id === id);
    return registro ? of(registro) : throwError(() => new Error('Registro não encontrado'));
  }); }
  private salvar(dados: Funcionario, novo: boolean) { return this.dados.salvarFuncionario(this.paraTela(dados), novo).then(f => this.converter(f)); }
  inserir(dados: Funcionario) { return defer(() => this.salvar(dados, true)); }
  alterar(dados: Funcionario) { return defer(() => this.salvar(dados, false)); }
  buscarPorEmail(email: string) { return defer(() => of(this.listar().filter(c => c.email.toLowerCase() === email.trim().toLowerCase()))); }
}
