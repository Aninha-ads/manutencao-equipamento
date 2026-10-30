import { rotaInicial } from './rota-por-perfil';

describe('rotaInicial', () => {
  it('cliente vai para o painel do cliente', () => {
    expect(rotaInicial('CLIENTE')).toBe('/painel-cliente');
  });

  it('funcionário vai para o painel do funcionário', () => {
    expect(rotaInicial('FUNCIONARIO')).toBe('/painel-funcionario');
  });

  it('perfil ausente volta para o login', () => {
    expect(rotaInicial(null)).toBe('/login');
    expect(rotaInicial(undefined)).toBe('/login');
  });
});
