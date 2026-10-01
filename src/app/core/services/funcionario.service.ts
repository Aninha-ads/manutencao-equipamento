// src/app/core/services/funcionario.service.ts
import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario.model';
import { hashPassword, hashPasswordComSalt } from './hash.util';

const LS_CHAVE: string = 'funcionarios';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {

  /**
    retorna todos funcionarios cadastrados
   */
  listarTodos(): Funcionario[] {
    const funcionarios = localStorage[LS_CHAVE];
    return funcionarios ? JSON.parse(funcionarios) : [];
  }

  /**
   busca por ID
   */
  buscarPorId(id: number): Funcionario | undefined {
    return this.listarTodos().find(f => f.id === id);
  }

  /**
   busca por login 
   */
  buscarPorLogin(login: string): Funcionario | undefined {
    return this.listarTodos().find(f => f.login === login);
  }

  /**
   insere novo func.
   */
  async inserir(funcionario: Funcionario): Promise<void> {
    const funcionarios = this.listarTodos();

    if (this.buscarPorLogin(funcionario.login)) {
      throw new Error('Já existe um funcionário com este login.');
    }

    funcionario.senha = await hashPassword(funcionario.senha);
    funcionario.id = new Date().getTime();

    funcionarios.push(funcionario);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  /**
   atualiza func
   */
  async atualizar(funcionario: Funcionario): Promise<void> {
    const funcionarios = this.listarTodos();
    const antigo = funcionarios.find(f => f.id === funcionario.id);

    if (!antigo) {
      throw new Error('Funcionário não encontrado para atualização.');
    }

    if (funcionario.senha !== antigo.senha) {
      funcionario.senha = await hashPassword(funcionario.senha);
      // gera um novo HASH caso senha seja atualizada
    }

    funcionarios.forEach((obj, index, objs) => {
      if (funcionario.id === obj.id) {
        objs[index] = funcionario;
      }
    });

    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  /**
   remove por ID 
   */
  remover(id: number): void {
    let funcionarios = this.listarTodos();
    funcionarios = funcionarios.filter(f => f.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  /**
   valida login/senha.
   separa o salt do hash salvo, refaz o hash com a senha digitada e compara.
   */
  async validarLogin(login: string, senha: string): Promise<Funcionario | null> {
    const funcionario = this.buscarPorLogin(login);
    if (!funcionario) return null;

    const [saltHex, hashSalvo] = funcionario.senha.split(':');
    if (!saltHex || !hashSalvo) return null;

    const hashDigitado = await hashPasswordComSalt(senha, saltHex);
    return hashDigitado === hashSalvo ? funcionario : null;
  }
}