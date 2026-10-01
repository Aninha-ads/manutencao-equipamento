// src/app/sandbox/teste-funcionario.ts
import { FuncionarioService } from '../core/services/funcionario.service';
import { Funcionario } from '../core/models/funcionario.model';

type Modo = 'inserir' | 'validar' | 'limpar' | 'nada';

// Muda aqui pra escolher o que roda:
//   inserir -> cadastra 5
//   validar -> testa login
//   limpar  -> apaga tudo
//   nada    -> nao faz nada
const MODO: Modo = 'inserir';

export async function executarTesteFuncionario(
  service: FuncionarioService
): Promise<void> {
  if (MODO === 'nada') return;

  if (MODO === 'limpar') {
    service.listarTodos().forEach(f => service.remover(f.id));
    console.log('lista limpa:', service.listarTodos().length);
    return;
  }

  if (MODO === 'inserir') {
    const caras = [
      new Funcionario(0, 'Admin',   'admin@x.com', '1980-01-01', true, 'admin',   'admin123', 'ADMIN'),
      new Funcionario(0, 'Gerente', 'ger@x.com',   '1985-02-02', true, 'gerente', 'ger123',   'GERENTE'),
      new Funcionario(0, 'Func',    'func@x.com',  '1990-03-03', true, 'func',    'func123',  'FUNC'),
      new Funcionario(0, 'Maria',   'maria@x.com', '1992-04-04', true, 'maria',   'maria123', 'FUNC'),
      new Funcionario(0, 'Joao',    'joao@x.com',  '1995-05-05', true, 'joao',    'joao123',  'GERENTE'),
    ];

    for (const f of caras) {
      try {
        await service.inserir(f);
        console.log('inserido:', f.login);
      } catch (e) {
        console.warn('erro ao inserir', f.login, (e as Error).message);
      }
    }

    console.log('lista:', service.listarTodos());
    return;
  }

  if (MODO === 'validar') {
    const tentativas = [
      ['admin',   'admin123'],  // ok
      ['gerente', 'ger123'],    // ok
      ['func',    'func123'],   // ok
      ['admin',   'errada'],    // senha errada
      ['ninguem', 'qualquer'],  // nao existe
    ];

    for (const [login, senha] of tentativas) {
      const r = await service.validarLogin(login, senha);
      console.log(login, '/', senha, '->', r ? 'ok ' + r.perfil : 'null');
    }
  }
}