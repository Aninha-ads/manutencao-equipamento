import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalRejeitarServicoComponent } from './modal-rejeitar-servico/modal-rejeitar-servico.component';
import { DadosService } from '../../core/services/dados.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visualizar-servico', standalone: true, imports: [RouterLink, DatePipe],
  templateUrl: './visualizar-servico.component.html', styleUrl: './visualizar-servico.component.css'
})
export class VisualizarServicoComponent {
  private dados = inject(DadosService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private readonly chaveClienteLogado = 'clienteLogadoId';
  solicitacao = this.carregar();
  historico = this.ordenar(this.solicitacao?.historico);
  get interfaceFuncionario(): boolean {
    return this.route.snapshot.data['interfaceFuncionario'] === true;
  }
  get rotaVoltar(): string {
    if (this.interfaceFuncionario) return '/painel-funcionario';
    const origem = this.route.snapshot.queryParamMap.get('origem');
    return origem === 'painel-funcionario' || origem === 'visualizacao-solicitacoes'
      ? '/' + origem : '/painel-cliente';
  }
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => {
      this.solicitacao = this.carregar();
      this.historico = this.solicitacao?.historico ?? [];
      this.cdr.markForCheck();
    });
  }
  private carregar() {
    const registro = this.dados.buscarSolicitacao(this.route.snapshot.paramMap.get('id'));
    if (!registro || !this.temAcesso(registro.clienteId)) return undefined;
    return {
      ...registro,
      categoria: registro.categoria ?? 'Não informada',
      cliente: registro.cliente ?? 'Não informado', 
      email: registro.email ?? 'Não informado',
      telefone: registro.telefone ?? 'Não informado', 
      defeito: registro.descricao
    };
  }
  private ordenar<T extends { dataHora: string }>(lista: T[] = []): T[] {
    return [...lista].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }

  private temAcesso(clienteId?: number): boolean {
    // Esta interface só é alcançada pela rota protegida para funcionários.
    if (this.interfaceFuncionario) return true;
    const origem = this.route.snapshot.queryParamMap.get('origim');
    if (origem === 'painel-funcionario' || origem == 'visualizacao-solicitacoes') return true;
    const logado = localStorage.getItem(this.chaveClienteLogado);
    return !logado || clienteId === undefined || clienteId === Number(logado);
  }

  get podeRejeitar(): boolean {
    return !this.interfaceFuncionario && this.solicitacao?.estado === 'ORCADA' && this.rotaVoltar === '/painel-cliente';
  }
  abrirModalRejeitar() {
    const modalRef = this.modalService.open(ModalRejeitarServicoComponent);
    modalRef.result.then((motivo: string) => console.log('Motivo da rejeição:', motivo), () => {});
  }
}
