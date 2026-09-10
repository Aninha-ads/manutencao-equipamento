import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFuncionariosComponent } from './manter-funcionarios.component';

describe('ManterFuncionariosComponent', () => {
  // Referências usadas para acessar o componente e sua instância de teste.
  let component: ManterFuncionariosComponent;
  let fixture: ComponentFixture<ManterFuncionariosComponent>;

  beforeEach(async () => {
    // Configura o componente standalone antes de cada teste.
    await TestBed.configureTestingModule({
      imports: [ManterFuncionariosComponent],
    }).compileComponents();

    // Cria uma nova instância limpa do componente para cada cenário.
    fixture = TestBed.createComponent(ManterFuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    // Confirma que o componente pode ser criado sem erros.
    expect(component).toBeTruthy();
  });

  it('deve impedir a remoção do funcionário logado', () => {
    // Substitui o alerta real por um espião para verificar sua mensagem.
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    // Tenta remover o funcionário atualmente logado.
    component.removerFuncionario(component.funcionarios[0]);

    // O registro deve permanecer e o alerta deve informar o bloqueio.
    expect(component.funcionarios).toHaveLength(2);
    expect(alerta).toHaveBeenCalledWith('Você não pode remover seu próprio usuário.');
    alerta.mockRestore();
  });

  it('deve impedir a remoção do último funcionário', () => {
    // Substitui o alerta real e deixa apenas um funcionário na lista.
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    component.funcionarios = [component.funcionarios[1]];
    component.funcionarioLogadoId = 99;

    // Tenta remover o único funcionário restante.
    component.removerFuncionario(component.funcionarios[0]);

    // O sistema deve manter pelo menos um registro.
    expect(component.funcionarios).toHaveLength(1);
    expect(alerta).toHaveBeenCalledWith('O sistema precisa possuir pelo menos um funcionário.');
    alerta.mockRestore();
  });

  it('deve impedir e-mail duplicado durante a edição', () => {
    // Substitui o alerta para verificar a mensagem de duplicidade.
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    // Coloca o segundo funcionário em modo de edição e informa o e-mail do primeiro.
    component.editarFuncionario(component.funcionarios[1]);
    component.email = ' MARIA@EMPRESA.COM ';

    // Tenta salvar a edição com um e-mail já utilizado.
    component.atualizarFuncionario();

    // O e-mail original deve ser preservado e o alerta deve ser exibido.
    expect(component.funcionarios[1].email).toBe('mario@empresa.com');
    expect(alerta).toHaveBeenCalledWith('Este e-mail já está cadastrado para outro funcionário.');
    alerta.mockRestore();
  });
});
