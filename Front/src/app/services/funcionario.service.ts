import { inject, Injectable } from '@angular/core';
import { defer, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Funcionario } from '../models/funcionario.model';
import { DadosService } from '../core/services/dados.service';
import { FuncionarioTela } from '../core/models/dados-tela.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private dados = inject(DadosService);
  private http = inject(HttpClient); 
  
  private apiUrl = 'http://localhost:8080/api/funcionarios'; 

  private converter(f: FuncionarioTela): Funcionario {
    return { id: f.id, nome: f.nome, email: f.email, dataNascimento: f.nascimento, ativo: true };
  }
  private listar() { return this.dados.listarFuncionarios().map(f => this.converter(f)); }
  private paraTela(f: Funcionario): FuncionarioTela {
    return { id: f.id ?? 0, nome: f.nome, email: f.email, nascimento: f.dataNascimento };
  }

  
  listarTodos() { return this.http.get<Funcionario[]>(this.apiUrl); }
  
  buscarPorId(id: number) { return this.http.get<Funcionario>(`${this.apiUrl}/${id}`); }
  
  private salvar(dados: Funcionario, novo: boolean) { return this.dados.salvarFuncionario(this.paraTela(dados), novo).then(f => this.converter(f)); }
  
  inserir(dados: Funcionario) { return this.http.post<Funcionario>(this.apiUrl, dados); }
  
  alterar(dados: Funcionario) { return this.http.put<Funcionario>(`${this.apiUrl}/${dados.id}`, dados); }
  
  buscarPorEmail(email: string) { return defer(() => of(this.listar().filter(c => c.email.toLowerCase() === email.trim().toLowerCase()))); }

  
  desativar(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}