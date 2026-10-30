import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VisualizarServicoComponent } from './visualizar-servico.component';
import { DadosService } from '../../core/services/dados.service';
import { SolicitacaoTela } from '../../core/models/dados-tela.model';

describe('VisualizarServicoComponent', () => {
  let component: VisualizarServicoComponent;
  let fixture: ComponentFixture<VisualizarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarServicoComponent],
      providers: [provideRouter([]), provideHttpClient(), {
        provide: DadosService,
        useValue: {
          buscarSolicitacao: () => ({
            id: 22, dataHora: '2026-10-30T00:34:15Z', equipamento: 'Notebook',
            descricao: 'Tela quebrada', estado: 'ABERTA', cliente: 'Zoe Reis', historico: []
          })
        }
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const estado of ['ABERTA', 'APROVADA', 'REJEITADA', 'PAGA'] as const) {
    it(`não apresenta o cliente como funcionário no evento ${estado}`, () => {
      component.historico = [{
        dataHora: '2026-10-30T00:34:15Z', estado, funcionario: 'Zoe Reis',
        descricao: 'Ação do cliente'
      }];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.timeline-content .funcionario')).toBeNull();
      expect(fixture.nativeElement.querySelector('.timeline-content').textContent).toContain('Ação do cliente');
    });
  }

  it('apresenta o funcionário que assumiu o atendimento ao orçar', () => {
    component.historico = [{
      dataHora: '2026-10-30T01:00:00Z', estado: 'ORCADA', funcionario: 'Maria Técnica',
      descricao: 'Orçamento registrado'
    }];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.timeline-content .funcionario').textContent)
      .toContain('Maria Técnica');
  });

  it('apresenta o destino e a transferência no redirecionamento', () => {
    component.historico = [{
      dataHora: '2026-10-30T02:00:00Z', estado: 'REDIRECIONADA', funcionario: 'Mário Técnico',
      descricao: 'Solicitação redirecionada', funcionarioOrigem: 'Maria Técnica',
      funcionarioDestino: 'Mário Técnico'
    }];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const evento = fixture.nativeElement.querySelector('.timeline-content');
    expect(evento.querySelector('.funcionario').textContent).toContain('Mário Técnico');
    expect(evento.textContent).toContain('Maria Técnica →');
  });

  it('não mostra o rótulo quando não há funcionário', () => {
    component.historico = [{
      dataHora: '2026-10-30T00:34:15Z', estado: 'ABERTA', funcionario: null,
      descricao: 'Solicitação aberta'
    }] satisfies NonNullable<SolicitacaoTela['historico']>;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.timeline-content .funcionario')).toBeNull();
  });
});
